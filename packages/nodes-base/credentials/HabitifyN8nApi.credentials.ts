import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class HabitifyN8nApi implements ICredentialType {
	name = 'habitifyN8nApi';
	displayName = 'Habitify N8n API';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
