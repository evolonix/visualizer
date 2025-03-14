export interface ContextService {
  isChannel: () => boolean;
}

export const contextService: ContextService = {
  isChannel: () => false,
};
