import React, { useCallback, useEffect } from 'react';
import { PlaidLinkError, usePlaidLink } from 'react-plaid-link';

const PlaidLink = (props: Props) => {
  const { token, handleResponse, onCancelPlaid } = props;

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
    onExit: (error: null | PlaidLinkError) =>  onCancelPlaid(error),
  });

  useEffect(() => {
    if (ready && open) {
      open();
    }
  }, [ready, open]);

  useEffect(() => {
    if (error) {
      console.log('error', error);
      handleResponse(null, error)
    }
  }, [error]);

  return <></>;
};

type Props = {
  token: string;
  onCancelPlaid: (error: null | PlaidLinkError) => void;
  handleResponse: (t: string | null, e: ErrorEvent | null) => void;
};
export default PlaidLink;
