import { getGreeting } from './greetings/get-greeating.action';
import { getPostLike } from './posts/get-postlike.action';
import { updLike } from './posts/upd-like.action';

export const server = {
  getGreeting,
  getPostLike,
  updLike,
};
