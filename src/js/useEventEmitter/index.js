import { useCallback, useContext, useEffect, useMemo } from "react";
import { Subject } from "rxjs";

import { EmitterContext } from "../EmitterProvider";

const useEventEmitter = (subscribers = () => {}, useGlobal = true) => {
  const { observable: globalObservable } = useContext(EmitterContext) ?? {};
  const observable = useMemo(
    () =>
      globalObservable instanceof Subject && useGlobal
        ? globalObservable
        : new Subject(),
    [globalObservable, useGlobal]
  );

  /* 
    Function to emit an event
    usage: 
    emit('SET_AUTH_TOKEN', response.auth)
    emit('USER_FETCH_SUCCESS', {
      user: response.user,
      permissions: response.permissions
    })
  */
  const emit = useCallback(
    (eventType, data) => observable?.next({ type: eventType, data }),
    [observable]
  );

  /* 
    To subscribe/unsubscribe to the observable on mount and/or change in the the subscribers instance.
    Note: subscribers function need to be memoized to reduce unnecessary unsubscribe-subscribe cycles
  */

  useEffect(() => {
    const subscription = observable.subscribe(subscribers);

    return () => subscription.unsubscribe();
  }, [observable, subscribers]);

  // Memoizing the returned object
  return useMemo(
    () => ({
      observable,
      emit
    }),
    [observable, emit]
  );
};

export { useEventEmitter };
