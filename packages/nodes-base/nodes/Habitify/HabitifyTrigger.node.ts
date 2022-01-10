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

export class HabitifyTrigger implements INodeType {
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
				displayName: 'Triggering Event',
				name: 'triggeringEvent',
				type: 'options',
				options: [
					{
						name: 'Habit Created',
						value: 'whenHabitCreated',
					},
					{
						name: 'User Created',
						value: 'whenUserCreated',
					},
					{
						name: 'User Deleted',
						value: 'whenUserDeleted'
					},
					{
						name: 'User Event',
						value: 'whenUserPerformEvent',
					}
				],
				default: 'whenUserPerformEvent',
				required: true,
				description: 'Event will be triggered in Habitify system',
			},
			{
				displayName: 'Event Name',
				name: 'userAnalyticEventName',
				type: 'string',
				displayOptions: {
					show: {
						triggeringEvent: [
							'whenUserPerformEvent',
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
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				const hookId: string = webhookData.webhookId as string;
				return await N8nHabitifyAPI.analyticEventTrigger.isHookRegistered({this: this, hookId: hookId});
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const triggeringEvent = this.getNodeParameter('triggeringEvent') as string;

				if (!webhookUrl || !triggeringEvent) {
					throw Error("Unable to find webhook url or triggering event");
				}

				let eventName: string | null;
				if (triggeringEvent === "whenHabitCreated") {
					eventName = "__whenHabitCreated"
				} else if (triggeringEvent === "whenUserCreated") {
					eventName = "__whenUserCreated"
				} else if (triggeringEvent === "whenUserDeleted") {
					eventName = "__whenUserDeleted"
				} else if (triggeringEvent === "whenUserPerformEvent") {
					eventName = this.getNodeParameter('userAnalyticEventName') as string;
				}  else {
					eventName = null;
				}

				if (!eventName) {
					throw Error("Unable to find event name");
				}

				let responseData;
				try {
					responseData = await N8nHabitifyAPI.analyticEventTrigger.registerHook({this: this, hookURL: webhookUrl, eventName});
				} catch (e) {
					if (e instanceof Error) {
						console.log(`Error: ${JSON.stringify(e.stack)}`);
					} else if (typeof(e) === "string") {
						console.log(`Error: ${e}`);
					}
					throw new Error("Unable to register new hook");
				}
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.hookId as string;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData("node");
				const hookId: string = webhookData.webhookId as string;
				if (hookId === undefined || !hookId) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				try {
					await N8nHabitifyAPI.analyticEventTrigger.unregisterHook({this: this, hookId: hookId});
				} catch (e) {
					if (e instanceof Error) {
							console.log(`Error: ${JSON.stringify(e.stack)}`);
					} else if (typeof(e) === "string") {
						console.log(`Error: ${e}`);
					}
					throw new Error("Unable to register new hook");
				}

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

