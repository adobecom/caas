import { registerSlot } from '../extensions/registry';
import MySessionsSection from './components/MySessionsSection';
import SpeakerSection from './components/SpeakerSection';

export default function registerEventSlots() {
    registerSlot('filters:left:afterMyFavorites', MySessionsSection);
    registerSlot('card:content:afterText', SpeakerSection);
}
