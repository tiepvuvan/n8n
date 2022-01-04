import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IWebhookSetupMethods,
} from 'n8n-workflow';

import * as N8nHabitifyAPI from './GenericFunctions'

export class Habitify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Habitify Trigger',
		name: 'HabitifyTrigger',
		icon: 'file:habitify-logo.png',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Habitify events via webhooks',
		defaults: {
			name: 'Habitify Trigger',
			color: '#6ad7b9',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'habitifyN8nApi',
				required: true
			}
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'New User Event',
						value: 'newUserEvent',
					},
				],
				default: 'newUserEvent',
				required: true,
				description: 'Resource to listen',
			},
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				displayOptions: {
					show: {
						resource: [
							'newUserEvent',
						],
					},
				},
				default: 'AppSession',
				description: 'Event Name to observe',
			},
		],
	};
	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(hook: IHookFunctions): Promise<boolean> {
				const webhookUrl = hook.getNodeWebhookUrl('default');
				const eventName = hook.getNodeParameter('eventName') as string;

				if (!webhookUrl || !eventName) {
					throw Error("");
				}

				return await N8nHabitifyAPI.analyticEventTrigger.isHookRegistered({this: hook, hookURL: webhookUrl, eventName});
			},
			async create(hook: IHookFunctions): Promise<boolean> {
				const webhookUrl = hook.getNodeWebhookUrl('default');
				const eventName = hook.getNodeParameter('eventName') as string;

				if (!webhookUrl || !eventName) {
					throw Error("");
				}
			  const result = await N8nHabitifyAPI.analyticEventTrigger.registerHook({this: hook, hookURL: webhookUrl, eventName});
				return true;
			},
			async delete(hook: IHookFunctions): Promise<boolean> {
				const webhookUrl = hook.getNodeWebhookUrl('default');
				const eventName = hook.getNodeParameter('eventName') as string;

				if (!webhookUrl || !eventName) {
					throw Error("");
				}
			  const result = await N8nHabitifyAPI.analyticEventTrigger.unregisterHook({this: hook, hookURL: webhookUrl, eventName});
				return true;
			}
		}
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [
				this.helpers.returnJsonArray(req.body),
			],
		}
	}
}

