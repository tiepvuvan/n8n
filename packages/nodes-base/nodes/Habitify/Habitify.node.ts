import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as N8nHabitifyAPI from './GenericFunctions'

export class Habitify implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Habitify',
			name: 'Habitify',
			icon: 'file:habitify-logo.png',
			group: ['transform'],
			version: 1,
			description: 'Habitify API',
			defaults: {
					name: 'Habitify',
					color: '#6ad7b9',
			},
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				{
					name: 'habitifyN8nApi',
					required: true
				}
			],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					options: [
						{
							name: 'User',
							value: 'user',
						}
					],
					default: 'user',
					required: true,
					description: 'Resource to consume',
				},
				{
					displayName: 'User Operation',
					name: 'userOperation',
					type: 'options',
					displayOptions: {
						show: {
							resource: [
								'user',
							],
						},
					},
					options: [
						{
							name: 'Get Info',
							value: 'getUserInfo',
							description: 'Get user info',
						},
						{
							name: 'Get Plan',
							value: 'getUserPlan',
							description: 'Get user current plan',
						},
						{
							name: 'Send Push Notification',
							value: 'sendPushNotification',
							description: 'Send push notification to user',
						},
						{
							name: 'Get Automation Event Count',
							value: 'getAutomationEventCount',
							description: 'Get automation event count',
						},
						{
							name: 'Log Automation Event',
							value: 'logAutomationEvent',
							description: 'Log automation event',
						},
					],
					default: 'getUserInfo',
					description: 'The operation to perform on user.',
				},
				{
					displayName: 'User Id',
					name: 'userId',
					type: 'string',
					required: true,
					default: '',
					description: 'User identifier',
				},
				{
					displayName: 'Push Title',
					name: 'pushTitle',
					type: 'string',
					displayOptions: {
						show: {
							resource: [
								'user',
							],
							userOperation: [
								'sendPushNotification'
							]
						},
					},
					required: true,
					default: '',
					description: 'Push notification title',
				},
				{
					displayName: 'Push body',
					name: 'pushBody',
					type: 'string',
					displayOptions: {
						show: {
							resource: [
								'user',
							],
							userOperation: [
								'sendPushNotification'
							]
						},
					},
					required: true,
					default: '',
					description: 'Push notification body',
				},
				{
					displayName: 'Automation Event Name',
					name: 'automationEventName',
					type: 'string',
					displayOptions: {
						show: {
							resource: [
								'user'
							],
							userOperation: [
								'getAutomationEventCount',
								'logAutomationEvent'
							]
						},
					},
					required: true,
					default: '',
					description: 'Automation Event Name',
				}
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			const returnData = [];
			const resource = this.getNodeParameter('resource', 0) as string;
			const userId = this.getNodeParameter('userId', 0) as string;

			const credentials = await this.getCredentials('habitifyN8nApi') as IDataObject;
			for (let i = 0; i < items.length; i++) {
				if (resource == "user") {
					const userOperation = this.getNodeParameter('userOperation', 0) as string;
					if (userOperation == "getUserInfo") {
						const responseData = await N8nHabitifyAPI.userAPI.getUserInfo(this, userId);
						returnData.push(responseData);
					} else if (userOperation == "getUserPlan") {
						const responseData = await N8nHabitifyAPI.userAPI.getUserPlan(this, userId);
						returnData.push(responseData);
					} else if (userOperation == "sendPushNotification") {
						const pushTitle: string | null = this.getNodeParameter("pushTitle", i) as string;
						const pushBody: string | null = this.getNodeParameter("pushBody", i) as string;
						if (!pushTitle && !pushBody) {
							continue;
						}
						const responseData = await N8nHabitifyAPI.userAPI.sendPushNotification(this, userId, pushTitle, pushBody);
						returnData.push(responseData);
					} else if (userOperation == "getAutomationEventCount") {
						const automationEventName: string | null = this.getNodeParameter("automationEventName", i) as string;
						const responseData = await N8nHabitifyAPI.userAPI.getAutomationEventCount(this, userId, automationEventName);
						returnData.push(responseData);
					} else if (userOperation == "logAutomationEvent") {
						const automationEventName: string | null = this.getNodeParameter("automationEventName", i) as string;
						const responseData = await N8nHabitifyAPI.userAPI.increaseAutomationEvent(this, userId, automationEventName);
						returnData.push(responseData);
					}
				}
			}
			return [this.helpers.returnJsonArray(returnData)];
	}
}
