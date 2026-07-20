"""Pure helpers for the incremental AI code-review findings engine.
No I/O and no env access, so these are unit-testable in isolation."""
import json
import re

_SEV = {'critical': '🔴', 'high': '🟠'}


def slugify(s):
    s = re.sub(r'[^a-z0-9]+', '-', (s or '').lower()).strip('-')
    return s[:40] or 'finding'


def parse_findings(text):
    """Extract findings from model output. Returns a list (possibly empty),
    or None if the output could not be parsed as the expected JSON."""
    if not text or not text.strip():
        return None
    t = text.strip()
    t = re.sub(r'^```(?:json)?', '', t).strip()
    t = re.sub(r'```$', '', t).strip()
    obj = None
    try:
        obj = json.loads(t)
    except Exception:
        a, b = t.find('{'), t.rfind('}')
        if a != -1 and b > a:
            try:
                obj = json.loads(t[a:b + 1])
            except Exception:
                obj = None
    if obj is None:
        return None
    if isinstance(obj, dict):
        items = obj.get('findings')
    elif isinstance(obj, list):
        items = obj
    else:
        items = None
    if not isinstance(items, list):
        return None
    out = []
    for it in items:
        if not isinstance(it, dict):
            continue
        title = str(it.get('title') or '').strip()
        if not title:
            continue
        sev = str(it.get('severity') or 'high').lower()
        if sev not in ('critical', 'high'):
            sev = 'high'
        fid = str(it.get('id') or '').strip() or slugify(title)
        out.append({'id': fid, 'severity': sev, 'title': title,
                    'detail': str(it.get('detail') or '').strip()})
    return out


def reconcile(prior, current, sha, now):
    """Merge prior findings state with current findings.
    Returns (merged_list, new_count, newly_resolved_count)."""
    prior_by_id = {f['id']: f for f in prior if isinstance(f, dict) and f.get('id')}
    cur_ids = {f['id'] for f in current}
    merged, new_ct, res_ct = [], 0, 0
    for cf in current:
        p = prior_by_id.get(cf['id'])
        if p and p.get('status') == 'open':
            merged.append({**cf, 'status': 'open',
                           'firstSha': p.get('firstSha', sha),
                           'firstAt': p.get('firstAt', now),
                           'lastAt': now, 'isNew': False})
        else:
            merged.append({**cf, 'status': 'open', 'firstSha': sha,
                           'firstAt': now, 'lastAt': now, 'isNew': True})
            new_ct += 1
    for p in prior:
        if not isinstance(p, dict) or not p.get('id') or p['id'] in cur_ids:
            continue
        if p.get('status') == 'resolved':
            merged.append({**p, 'isNew': False})
        else:
            merged.append({**p, 'status': 'resolved', 'resolvedAt': now,
                           'resolvedSha': sha, 'isNew': False})
            res_ct += 1
    return merged, new_ct, res_ct


def render_findings(merged, new_ct, res_ct):
    """Render the human-facing checklist body from the merged findings."""
    open_f = [f for f in merged if f.get('status') == 'open']
    res_f = [f for f in merged if f.get('status') == 'resolved']
    open_f.sort(key=lambda f: 0 if f.get('severity') == 'critical' else 1)
    res_f = res_f[-10:][::-1]
    parts = []
    summary = "**%d open · %d resolved**" % (len(open_f), len(res_f))
    delta = []
    if new_ct:
        delta.append('+%d new' % new_ct)
    if res_ct:
        delta.append('%d marked resolved' % res_ct)
    if delta:
        summary += "  ·  _this run: %s_" % ', '.join(delta)
    parts.append(summary)
    parts.append('')
    parts.append('### Open findings')
    if open_f:
        for f in open_f:
            badge = _SEV.get(f.get('severity'), _SEV['high'])
            tag = ' 🆕' if f.get('isNew') else ''
            since = '' if f.get('isNew') or not f.get('firstSha') else ' _(open since `%s`)_' % f['firstSha']
            parts.append('- [ ] %s **%s**%s%s' % (badge, f['title'], tag, since))
            if f.get('detail'):
                parts.append('  %s' % f['detail'].replace('\n', ' ').strip())
    else:
        parts.append('_No open findings._ ✅')
    if res_f:
        parts.append('')
        parts.append('### ✅ Resolved')
        for f in res_f:
            badge = _SEV.get(f.get('severity', 'high'), _SEV['high'])
            when = f.get('resolvedSha') or ''
            parts.append('- [x] ~~%s **%s**~~ — resolved%s'
                         % (badge, f['title'], (' in `%s`' % when) if when else ''))
    return '\n'.join(parts)
