import { URL } from "url";
import * as nodePath from "path";

import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-workflow';

const habitifyAPIURL: URL = new URL("https://us-central1-project-8491986773398252429.cloudfunctions.net");

export const userAPI = {
	getAutomationEventCount: async function(node: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, userId: string, eventName: string): Promise<any> {
		if (!node.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "userEventCounter", "count");
		const credentials = await node.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;
		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			qs: {
				eventName: eventName,
				userId: userId,
			},
			method: "GET",
			uri: requestURL.toString()
		};
		const textResponse = await node.helpers.request(requestOptions);
		return JSON.parse(textResponse);
	},
	increaseAutomationEvent: async function(node: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, userId: string, eventName: string): Promise<any> {
		if (!node.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "userEventCounter", "log");
		const credentials = await node.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;
		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			body: {
				eventName: eventName,
				userId: userId,
			},
			json: true,
			method: "POST",
			uri: requestURL.toString()
		};
		return await node.helpers.request(requestOptions);
	},
	getUserInfo: async function(node: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, userId: string): Promise<any> {
		if (!node.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "users", userId, "info");
		const credentials = await node.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;
		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			method: "GET",
			uri: requestURL.toString()
		};
		const textResponse = await node.helpers.request(requestOptions);
		return JSON.parse(textResponse);
	},
	getUserPlan: async function(node: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, userId: string): Promise<any> {
		if (!node.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "users", userId, "plan");
		const credentials = await node.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;
		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			method: "GET",
			uri: requestURL.toString(),
		};
		const textResponse = await node.helpers.request(requestOptions);
		return JSON.parse(textResponse);
	},
	sendPushNotification: async function(node: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, userId: string, title: string | null, body: string | null): Promise<any> {
		if (!node.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "userAction", "pushNotification");
		const credentials = await node.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;

		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			method: "POST",
			body: {
				userId: userId,
				title: title,
				body: body,
			},
			json: true,
			uri: requestURL.toString(),
		};

		try {
			await node.helpers.request(requestOptions);
			return {
				sent: true,
			};
		} catch (error) {
			throw error;
		}
	}
}

export const analyticEventTrigger = {
	isHookRegistered: async function(input: {this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, hookId: string}): Promise<boolean> {
		if (!input.this.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "analyticEventHook", "registration");
		const credentials = await input.this.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;

		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			method: "GET",
			qs: {
				hookId: input.hookId
			},
			uri: requestURL.toString(),
		};

		try {
			const result = await input.this.helpers.request(requestOptions);
			return result.registered;
		} catch (error) {
			throw error;
		}
	},
	registerHook: async function(input: {this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, hookURL: string, eventName: string}): Promise<any> {
		if (!input.this.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "analyticEventHook", "register");
		const credentials = await input.this.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;

		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			method: "POST",
			body: {
				url: input.hookURL,
				eventName: input.eventName,
			},
			json: true,
			uri: requestURL.toString(),
		};
		return await input.this.helpers.request(requestOptions);
	},
	unregisterHook: async function(input: {this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, hookId: string}): Promise<boolean> {
		if (!input.this.helpers.request) {
			return false;
		}
		const requestURL = new URL(habitifyAPIURL.toString());
		requestURL.pathname = nodePath.join("n8nIntegrationEndpoint", "analyticEventHook", "unregister");
		const credentials = await input.this.getCredentials('habitifyN8nApi') as IDataObject;
		const apiKey = credentials.apiKey;

		const requestOptions: OptionsWithUri = {
			headers: {
				"Content-Type": "application/json",
				"HabitifyN8nClientCredential": apiKey
			},
			method: "POST",
			body: {
				hookId: input.hookId,
			},
			uri: requestURL.toString(),
		};

		try {
			const result = await input.this.helpers.request(requestOptions);
			return true;
		} catch (error) {
			throw error;
		}
	}
}
