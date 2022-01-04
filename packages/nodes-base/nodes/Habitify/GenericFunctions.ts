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

export const analyticEventTrigger = {
	isHookRegistered: async function(input: {this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, hookURL: string, eventName: string}): Promise<boolean> {
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
				url: input.hookURL,
				eventName: input.eventName,
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
	registerHook: async function(input: {this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, hookURL: string, eventName: string}): Promise<boolean> {
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
			json: {
				url: input.hookURL,
				eventName: input.eventName,
			},
			uri: requestURL.toString(),
		};

		try {
			const result = await input.this.helpers.request(requestOptions);
			return true;
		} catch (error) {
			throw error;
		}
	},
	unregisterHook: async function(input: {this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, hookURL: string, eventName: string}): Promise<boolean> {
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
			json: {
				url: input.hookURL,
				eventName: input.eventName,
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
