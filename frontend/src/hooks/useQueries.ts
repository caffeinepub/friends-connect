import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Friend, Message } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Friends ─────────────────────────────────────────────────────────────────

export function useGetFriendsList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Friend[]>({
    queryKey: ['friendsList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFriendsList();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

export function useAddFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFriend(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsList'] });
    },
  });
}

export function useRemoveFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFriend(friendName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsList'] });
    },
  });
}

// ─── Messages ────────────────────────────────────────────────────────────────

export function useGetMessagesWithFriend(friendUsername: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', friendUsername],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessagesWithFriend(friendUsername);
    },
    enabled: !!actor && !actorFetching && !!friendUsername,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ friendUsername, content }: { friendUsername: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(friendUsername, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.friendUsername] });
    },
  });
}
