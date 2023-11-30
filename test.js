/* eslint-disable */
const { URL } = require('url');
const fetch = require('node-fetch');

const locales = {
    '': { ietf: 'en-US', tk: 'hah7vzn.css', caas: 'en-US' },
    ae_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // mismatch use milo here. need to grab country. aem just has en
    ae_en: { ietf: 'en', tk: 'pps7abe.css', caas: "en-US" }, // mismatch use milo here. need to grab country.
    africa: { ietf: 'en', tk: 'pps7abe.css', caas: "en-ZA" }, // should use milo since ZA is south africa
    ar: { ietf: 'es-AR', tk: 'oln4yqj.css', caas: 'es-AR' },
    at: { ietf: 'de-AT', tk: 'vin7zsi.css', caas: 'de-AT' },
    au: { ietf: 'en-AU', tk: 'pps7abe.css', caas: 'en-AU' },
    be_en: { ietf: 'en-BE', tk: 'pps7abe.css', caas: 'en-BE' },
    be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css', caas: 'fr-BE' },
    be_nl: { ietf: 'nl-BE', tk: 'cya6bri.css', caas: 'nl-BE' },
    bg: { ietf: 'bg-BG', tk: 'aaz7dvd.css', caas: 'bg-BG' },
    br: { ietf: 'pt-BR', tk: 'inq1xob.css', caas: 'pt-BR' },
    ca_fr: { ietf: 'fr-CA', tk: 'vrk5vyv.css', caas: 'en-CA'  }, // should use milo since ca-fr should exist and not fallback to ca-en
    ca: { ietf: 'en-CA', tk: 'pps7abe.css', caas: 'en-CA' },
    ch_de: { ietf: 'de-CH', tk: 'vin7zsi.css', caas: "en-US" }, // mismatch! should use milo I think since aem doesn't have
    ch_fr: { ietf: 'fr-CH', tk: 'vrk5vyv.css' }, // mismatch! should use milo I think since aem doesn't have
    ch_it: { ietf: 'it-CH', tk: 'bbf5pok.css' }, // mismatch! should use milo I think since aem doesn't have
    cl: { ietf: 'es-CL', tk: 'oln4yqj.css', caas: 'es-CL' },
    cn: { ietf: 'zh-CN', tk: 'puu3xkp', caas: "zh-Hans-CN" }, // mismatch! need to use CaaS I think
    co: { ietf: 'es-CO', tk: 'oln4yqj.css', caas: 'es-CO' },
    cr: { ietf: 'es-419', tk: 'oln4yqj.css', caas: "es-CR" }, // mismatch. cr redirected to la then es-LA
    cy_en: { ietf: 'en-CY', tk: 'pps7abe.css', caas: 'en-CY'},
    cz: { ietf: 'cs-CZ', tk: 'aaz7dvd.css', caas: 'cs-CZ' },
    de: { ietf: 'de-DE', tk: 'vin7zsi.css', caas: "de-DE" },
    dk: { ietf: 'da-DK', tk: 'aaz7dvd.css', caas: "da-DK" },
    ec: { ietf: 'es-419', tk: 'oln4yqj.css', caas: "es-EC" }, // mismatch use milo. cr redirected to la then es-LA
    ee: { ietf: 'et-EE', tk: 'aaz7dvd.css', caas: "et-EE" },
    eg_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl', caas: "en-US" }, // mismatch: eg_en redirects to mena_en exception goes to en
    eg_en: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-US" }, // mismatch: eg_en redirects to mena_en exception goes to en
    el: { ietf: 'el', tk: 'aaz7dvd.css', caas: "en-US" }, // mismatch: use milo goes to en-US
    es: { ietf: 'es-ES', tk: 'oln4yqj.css', caas: "es-ES" },
    fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css', caas: "fi-FI" },
    fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css', caas: "fr-FR" },
    gr_el: { ietf: 'el', tk: 'fnx0rsr.css', caas: "en-US" }, // mismatch! should use milo I think since aem doesn't have
    gr_en: { ietf: 'en-GR', tk: 'pps7abe.css', caas: "en-GR"},
    gt: { ietf: 'es-419', tk: 'oln4yqj.css', caas: "gt-ES" }, // mismatch use milo
    hk_en: { ietf: 'en-HK', tk: 'pps7abe.css', caas: "en-HK"},
    hk_zh: { ietf: 'zh-HK', tk: 'jay0ecd', caas: "zh-HK"},
    hu: { ietf: 'hu-HU', tk: 'aaz7dvd.css', caas: "hu-HU" },
    id_en: { ietf: 'en', tk: 'pps7abe.css', caas: "en-US" }, // mismatch use milo here. need to grab country
    id_id: { ietf: 'id', tk: 'czc0mun.css', caas: "en-US" }, // mismatch use milo here. need to grab country
    ie: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-IE" }, // mismatch for ireland use milo here for gb support. shouldn't use en
    il_en: { ietf: 'en-IL', tk: 'pps7abe.css', caas: 'en-IL' },
    il_he: { ietf: 'he', tk: 'nwq1mna.css', dir: 'rtl', caas: 'en-IL' }, // mismatch use milo here. need to grab country
    in_hi: { ietf: 'hi', tk: 'aaa8deh.css', caas: "in-EN" }, // mismatch use milo here for hindi support. need to grab country
    in: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "in-EN" }, // mismatch use milo here since GB is closer than EN
    it: { ietf: 'it-IT', tk: 'bbf5pok.css', caas: 'it-IT' },
    jp: { ietf: 'ja-JP', tk: 'dvg6awq', caas: 'ja-JP' },
    kr: { ietf: 'ko-KR', tk: 'qjs5sfm', caas: 'ko-KR' },
    kw_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl', caas: "en-US" }, // mismatch, use milo
    kw_en: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-US" }, // mismatch, use milo
    la: { ietf: 'es-LA', tk: 'oln4yqj.css', caas: "la" }, // mismatch so will just use milo es-LA
    langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
    lt: { ietf: 'lt-LT', tk: 'aaz7dvd.css', caas: "lt-LT" },
    lu_de: { ietf: 'de-LU', tk: 'vin7zsi.css', caas: 'de-LU' },
    lu_en: { ietf: 'en-LU', tk: 'pps7abe.css' , caas: "en-LU"},
    lu_fr: { ietf: 'fr-LU', tk: 'vrk5vyv.css', caas: "fr-LU" },
    lv: { ietf: 'lv-LV', tk: 'aaz7dvd.css', caas: "lv-LV" },
    mena_ar: { ietf: 'ar', tk: 'dis2dpj.css', dir: 'rtl', caas: "ar" },// mismatch if no ability to split. need to grab country. pageConfigHelper()?.locale.region
    mena_en: { ietf: 'en', tk: 'pps7abe.css', caas: "en" }, // mismatch if no ability to split. need to grab country. pageConfigHelper()?.locale.region
    mt: { ietf: 'en-MT', tk: 'pps7abe.css', caas: "en-MT" },
    mx: { ietf: 'es-MX', tk: 'oln4yqj.css', caas: "es-MX" },
    my_en: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-US" },
    my_ms: { ietf: 'ms', tk: 'sxj4tvo.css', caas: "en-US" }, // mismatch use milo here. need to grab country
    ng: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-NG" }, // mismatch. Should be en-NG but if milo doesn't support then makes more sense to use GB
    nl: { ietf: 'nl-NL', tk: 'cya6bri.css', caas: "nl-NL" },
    no: { ietf: 'no-NO', tk: 'aaz7dvd.css', caas: "no-NO" },
    nz: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-NZ" }, // mismatch caas/milo
    pe: { ietf: 'es-PE', tk: 'oln4yqj.css', caas: 'es-PE' },
    ph_en: { ietf: 'en', tk: 'pps7abe.css',  caas: 'en-US'}, // mismatch because aem doesn't have. use milo.
    ph_fil: { ietf: 'fil-PH', tk: 'ict8rmp.css', caas: 'en-US' }, // mismatch because aem doesn't have. use milo.
    pl: { ietf: 'pl-PL', tk: 'aaz7dvd.css', caas: "pl-PL"},
    pr: { ietf: 'es-419', tk: 'oln4yqj.css', caas: "es-PR" }, // mismatch. use milo becomes to es-LA
    pt: { ietf: 'pt-PT', tk: 'inq1xob.css', caas: "pt-PT"},
    qa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl', caas: "en-US" }, // mismatch because aem doesn't have. use milo.
    qa_en: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-US" }, // mismatch because aem doesn't have. use milo.
    ro: { ietf: 'ro-RO', tk: 'aaz7dvd.css', caas: 'ro-RO' },
    ru: { ietf: 'ru-RU', tk: 'aaz7dvd.css', caas: 'ru-RU' },
    sa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl', caas: "en-US" }, // mismatch use milo. if no ability to split. need to grab country. pageConfigHelper()?.locale.region
    sa_en: { ietf: 'en', tk: 'pps7abe.css', caas: "en-US" }, // mismatch use milo. if no ability to split. need to grab country. pageConfigHelper()?.locale.region
    se: { ietf: 'sv-SE', tk: 'fpk1pcd.css', caas: 'sv-SE' },
    sg: { ietf: 'en-SG', tk: 'pps7abe.css', caas: 'en-US' }, // mismatch caas/milo.
    si: { ietf: 'sl-SI', tk: 'aaz7dvd.css', caas: 'sl-SI' },
    sk: { ietf: 'sk-SK', tk: 'aaz7dvd.css', caas: 'sk-SK' },
    th_en: { ietf: 'en', tk: 'pps7abe.css', caas: "th-EN" }, // mismatch use milo. if no ability to split. need to grab country. pageConfigHelper()?.locale.region
    th_th: { ietf: 'th', tk: 'aaz7dvd.css', caas: "en-US" }, // mismatch use milo since aem falls back to en-US
    tr: { ietf: 'tr-TR', tk: 'aaz7dvd.css', caas: 'tr-TR' },
    tw: { ietf: 'zh-TW', tk: 'jay0ecd', caas: "zh-TW" },
    ua: { ietf: 'uk-UA', tk: 'aaz7dvd.css', caas: "uk-UA" },
    uk: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-GB" },
    vn_en: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-US" }, // mismatch. Use Milo even though vietnamese probably speak en-US
    vn_vi: { ietf: 'vi', tk: 'jii8bki.css', caas: "en-US" }, // mismatch. Use Milo
    za: { ietf: 'en-GB', tk: 'pps7abe.css', caas: "en-ZA" }, // mismatch. Should be en-ZA but if milo doesn't support then makes more sense to use GB
};

const verifyCardsContent = async (url) => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        if (json.cards && json.cards.length > 0) return true;
        else return false;
    } catch (error) {
        console.error(error);
    }
    return false;
}

Object.keys(locales).forEach(async key => {
    const region = key.split('_')[0];
    let locale = locales[key].ietf || 'en-us'; // id
    let country = locale.split('-')[1];
    if(!country || country === '419'){
        country = region;
    }
    const language = locale.split("-")[0];

    let url = new URL(`https://www.adobe.com/chimera-api/collection?contentSource=bacom&originSelection=&contentTypeTags=&collectionTags=&excludeContentWithTags=&language=${language}&country=${country}&complexQuery=&currentEntityId=&featuredCards=&environment=&size=10&flatFile=false&debug=true`);
    let cardsContent = await verifyCardsContent(url);
    if(!cardsContent){
        console.log(`language: ${language}, country: ${country}`);
    }
});