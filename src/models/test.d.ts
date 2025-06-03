export type EntityOpts = {
	allowApiUpdate?: (value: unknown, remult: unknown) => boolean;
	saved?: (value: unknown) => Promise<void>;
};
export type WithDynamicOpts = (options: unknown, remult: unknown) => void;
export type WithSaved = { saved?: (value: unknown) => void };
export type WithServerExpr = {
	serverExpression?: (value: unknown) => object;
};
export type WithValidate = {
	validate?: (value: unknown, event?: ValidateFieldEvent) => void;
};
