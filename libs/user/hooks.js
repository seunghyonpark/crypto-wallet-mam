import { fetcher } from '@/libs/fetch';
import useSWR from 'swr';

export function useCurrentUser() {
  return useSWR('/api/gooduser', fetcher);
}

export function useUser(id) {
  return useSWR(`/api/goodusers/${id}`, fetcher);
}
