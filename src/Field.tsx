import {
	cloneElement,
	useContext,
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
} from "react";
import { FieldContext } from "./Form";
import { FieldProps } from "./interface";

function validChild(children: ReactNode): children is ReactElement {
	return !!children && typeof children === "object";
}

const Field: React.FC<FieldProps> = (props) => {
	console.log("Field render");
	const { children, name } = props;
	const { dispatch } = useContext(FieldContext);

	if (!validChild(children)) {
		return null;
	}

	const validate = useCallback(
		(value) => {
			return !!value ? Promise.resolve(true) : Promise.reject(false);
		},
		[children]
	);

	const onFormStoreChange = useCallback(() => {}, [children]);

	const eventFn = useCallback(
		(event) => {
			const originFn = children.props.onChange;
			dispatch({
				type: "updateValue",
				payload: {
					name,
					value: event.target.value,
				},
			});

			if (originFn) {
				originFn(event);
			}
		},
		[children]
	);

	useEffect(() => {
		dispatch({
			type: "initField",
			payload: {
				name,
				field: {
					validate,
					onFormStoreChange,
				},
			},
		});
	}, [children]);

	return cloneElement(children, { ...children.props, onChange: eventFn });
};

export default Field;
