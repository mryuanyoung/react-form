import {
	createContext,
	FormEvent,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { ActionType, Field, FormCallback, FormProps } from "./interface";

class FormStore {
	private store: Record<string, unknown>;
	private fields: Record<string, Field>;
	private callbacks: FormCallback;
	private observers: Record<string, Field[]>;

	constructor() {
		this.store = {};
		this.fields = {};
		this.observers = {};
		this.callbacks = { onFieldsChange: () => {}, onFinish: () => {} };
	}

	public validate = async () => {
		try {
			const isValid = await Promise.all(
				Object.keys(this.fields).map((name) => {
					const field = this.fields[name];
					return field.validate(this.store[name]);
				})
			);

			return isValid.every((b) => b);
		} catch (err) {
			console.warn("something wrong happened");
		}
	};

	private onFinish = async () => {
		const isValid = await this.validate();
		if (!isValid) {
			return;
		}

		this.callbacks.onFinish && this.callbacks.onFinish(this.store);
	};

	private onFieldsChange = (changedField: string) => {
		this.callbacks.onFieldsChange &&
			this.callbacks.onFieldsChange(changedField, this.store);
	};

	// field => form
	public dispatch = (action: ActionType) => {
		switch (action.type) {
			case "updateValue":
				this.setValue(action.payload.name, action.payload.value);
				this.onFieldsChange(action.payload.name);
				break;
			case "initField":
				this.setField(action.payload.name, action.payload.field);
				break;
			case "submit":
				this.onFinish();
				break;
			default:
			// nothing
		}
	};

	// form => field
	private notify = () => {};

	private setValue = (name: string, value: typeof this.store.name) => {
		this.store[name] = value;
	};

	private setField = (name: string, field: Field) => {
		this.fields[name] = field;
	};

	public setCallbacks = (cbs: Partial<FormCallback>) => {
		Object.assign(this.callbacks, cbs);
	};
}

export const useForm = (form?: FormStore) => {
	const instance = useRef(form);

	if (!instance.current) {
		const ins = new FormStore();
		instance.current = ins;
	}

	return instance.current;
};

export const FieldContext = createContext<FormStore>({} as FormStore);

const Form: React.FC<FormProps> = (props) => {
	console.log("Form render");
	const { onFieldsChange, onFinish, children } = props;

	const form = useForm();

	const submit = (e: FormEvent) => {
		e.preventDefault();
		form.dispatch({ type: "submit", payload: null });
	};

	useEffect(() => {
		form.setCallbacks({
			onFieldsChange,
			onFinish,
		});
	}, [onFieldsChange, onFinish]);

	return (
		<form onSubmit={submit}>
			<FieldContext.Provider value={form}>{children}</FieldContext.Provider>
		</form>
	);
};

export default Form;
