import { i18n, TOptions } from "i18next";
import {
  TFunction,
  useTranslation,
  UseTranslationOptions,
  UseTranslationResponse,
} from "react-i18next";
import { NameSpace, TranslationKey } from "./translations";
 
type TypedNameSpaceOptions<N extends NameSpace> = TOptions & { ns?: N };
type TypedTranslationOptions<N extends NameSpace> = string | TypedNameSpaceOptions<N> | undefined;

type TFunctionParams<N extends NameSpace> = Parameters<TFunction<N, undefined>>;

type TFunctionType<N extends NameSpace> = (
  key: TranslationKey<N>,
  options?: TypedTranslationOptions<N>,
  defaultValue?: TFunctionParams<N>[1]
) => string;

type UseTypedTranslationResponse<N extends NameSpace> = {
  t: TFunctionType<N>;
  i18n: i18n;
  ready: boolean;
};

export function useTypedTranslation<N extends NameSpace>(
  ns?: N,
  options?: UseTranslationOptions
): UseTypedTranslationResponse<N> {
  const response: UseTranslationResponse<N, undefined> = useTranslation(
    ns,
    options
  );

  function _t(
    key: TranslationKey<N>,
    options?: Omit<TypedTranslationOptions<N>, 'ns'>,
    defaultValue?: TFunctionParams<N>[1]
  ) {
    return response.t(key as any, defaultValue, options);
  }

  return { ...response, t: _t as TFunctionType<N> };
}
