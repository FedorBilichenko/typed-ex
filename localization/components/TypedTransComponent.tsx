import React from "react";
import { Trans } from "react-i18next";
import { NameSpace, TranslationKey } from "~/localization/translations";

interface TypedTransComponentProps<N extends NameSpace> {
  i18nKey: TranslationKey<N>;
  ns: N;
  prefix?: string;
  components?: TypedComponents;
}

type TypedComponents =
  | React.ReactNode[]
  | {
      [tagName: string]: React.ReactNode;
      bold?: React.ReactNode;
      Link?: React.ReactNode;
    };

export function TypedTransComponent<N extends NameSpace>({
  i18nKey,
  ns,
  components,
  prefix,
}: TypedTransComponentProps<N>) {
  return (
    <Trans ns={ns} prefix={prefix} i18nKey={i18nKey as any} components={components} />
  );
}
