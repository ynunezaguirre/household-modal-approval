import React, { useCallback, useEffect } from 'react';
import { PlaidLinkError, usePlaidLink } from 'react-plaid-link';
import { PlaidMetadata } from '../../services/plaid-services';

const PlaidLink = (props: Props) => {
  const { token, handleResponse, onCancelPlaid } = props;

  const onSuccess = useCallback(
    (public_token, metadata) => {
      if (metadata?.institution || metadata?.account) {
        const data ={
          institution: {
            name: metadata.institution?.name,
          },
          account: [{
            mask: metadata.account?.mask,
            name: metadata.account?.name,
          }]
        };
        handleResponse(public_token, null, data);
      } else {
        handleResponse(public_token, null);
      }
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
      handleResponse(null, error)
    }
  }, [error]);

  return <></>;
};

type Props = {
  token: string;
  onCancelPlaid: (error: null | PlaidLinkError) => void;
  handleResponse: (t: string | null, e: ErrorEvent | null, data?: PlaidMetadata) => void;
};
export default PlaidLink;
