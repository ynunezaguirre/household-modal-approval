import React, { useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = (props: Props) => {
  const { token, handleResponse } = props;

  const onSuccess = useCallback(
    (public_token, metadata) => {
      console.log(public_token, metadata);
      handleResponse(public_token, null);
    },
    [],
  );

  const { open, ready, error } = usePlaidLink({
    token: token,
    onSuccess,
  });

  useEffect(() => {
    if (ready && open) {
      open();
    }
  }, [ready, open]);

  useEffect(() => {
    if (error) {
      handleResponse(null, error)
    }
  }, [error]);

  return <></>;
};

type Props = {
  token: string;
  handleResponse: (t: string | null, e: ErrorEvent | null) => void;
};
export default PlaidLink;
