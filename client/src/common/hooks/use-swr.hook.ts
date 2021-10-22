import React from "react";
import { useHistory } from "react-router-dom";
import useSWRBase, { Key, SWRResponse as responseInterfaceBase } from "swr";
import { Fetcher, PublicConfiguration } from "swr/dist/types";

import { useAppDispatch } from "common/hooks/use-redux.hook";

import { logout } from "features/auth/user.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

interface IErrorHandlers {
  [status: string]: () => void;
}

interface responseInterface<Data, Error>
  extends responseInterfaceBase<Data, Error> {
  isLoading: boolean;
}

type Options = Partial<PublicConfiguration<any, Error, Fetcher<any>>>;

export function useSWR<Data = any, Error = any>(
  key: Key,
  errorHandlers: IErrorHandlers = {},
  options: Options = {}
): responseInterface<Data, Error> {
  const { open } = useSnackbar();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const defaultErrorHandlers: IErrorHandlers = {
    "401": () => {
      // ignore authentication errors as the useUser hook will automatically log users out
    },
    "403": () => {
      // ignore authorization errors as the useUser hook will automatically log users out
    },
    "404": () => {
      open({
        severity: "error",
        message: "Page not found.",
      });
      history.push("/");
    },
    "500": () => {
      open({
        severity: "error",
        message: "An unspecified error has occurred.",
      });
      dispatch(logout());
      history.push("/");
    },
    ...errorHandlers,
  };

  const newOptions: any = options.onError
    ? options
    : {
        ...options,
        onError: (err: any) => {
          const status = err.response.status;
          if (defaultErrorHandlers[status]) {
            defaultErrorHandlers[status]();
          } else {
            open({
              severity: "error",
              message: "An unspecified error has occurred.",
            });
            history.push("/");
          }
        },
      };

  const {
    data: swrData,
    error,
    isValidating,
    mutate,
  } = useSWRBase<Data, Error>(key, newOptions);

  const [data, setData] = React.useState<Data>();

  React.useEffect(() => {
    setData((data) => {
      if (!swrData) {
        // prevent mutation of data if new data is undefined
        return data ?? swrData;
      }
      return swrData;
    });
  }, [swrData]);

  return {
    data,
    isLoading: !data && !error,
    error,
    isValidating,
    mutate,
  };
}
