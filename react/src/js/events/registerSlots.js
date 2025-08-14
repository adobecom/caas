import { registerSlot } from '../extensions/registry';
import MySessionsSection from './components/MySessionsSection';

export default function registerEventSlots() {
    registerSlot('filters:left:afterMyFavorites', MySessionsSection);
}
