import Form from "./Form";
import Field from "./Field";

function App() {
	return (
		<Form
			onFieldsChange={(changedFiled, Fields) =>
				console.log("[form]", changedFiled, Fields)
			}
			onFinish={(values) => {
				console.log("[form finished]", values);
			}}
		>
			<Field name="test1">
				<input type="text" onChange={(e) => console.log("[input] test1")} />
			</Field>
			<Field name="test2">
				<input type="text" onChange={(e) => console.log("[input] test2")} />
			</Field>

			<button type="submit">sumbit</button>
		</Form>
	);
}

export default App;
