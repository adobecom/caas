import { createContext, useContext } from 'react';

const CardContext = createContext();

export const useCardData = () => useContext(CardContext);

export default CardContext;
