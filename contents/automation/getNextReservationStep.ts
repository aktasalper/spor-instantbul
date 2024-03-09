export function getNextReservationStep(currentStep: AutomationState["satiskiralik"]) {
	let nextStep: AutomationState["satiskiralik"];
	switch (currentStep) {
		case null:
			nextStep = "branch";
			break;
		case "branch":
			nextStep = "facility";
			break;
		case "facility":
			nextStep = "field";
			break;
		case "field":
			nextStep = "reservation";
			break;
		case "reservation":
			nextStep = "to_cart";
			break;
		case "to_cart":
		default:
			nextStep = null;
	}

	return nextStep;
}
