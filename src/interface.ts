export interface ActionType {
	type: "updateValue" | "initField" | "submit";
	payload: any;
	// todo 怎么改呢
}

export interface UpdateValueActionPayload {
	name: string;
	value: unknown;
}

export interface InitFieldActionPayload {
	name: string;
	field: Field;
}

export interface Field {
	validate(value: unknown): Promise<boolean>;
}

export interface FormProps {
	onFinish?(values: unknown): void;
	onFieldsChange?(changedFields: unknown, allFields: unknown): void;
}

export type FormCallback = {
	[key in keyof FormProps]: FormProps[key] extends Function | undefined
		? FormProps[key]
		: never;
};

export interface FieldProps {
	name: string;
}
