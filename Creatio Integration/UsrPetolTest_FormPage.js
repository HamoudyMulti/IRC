define("UsrPetolTest_FormPage", /**SCHEMA_DEPS*/["@creatio-devkit/common"]/**SCHEMA_DEPS*/, function/**SCHEMA_ARGS*/(sdk)/**SCHEMA_ARGS*/ {
	return {
		viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"name": "Feed",
				"values": {
					"dataSourceName": "PDS",
					"entitySchemaName": "UsrPetolTest"
				}
			},
			{
				"operation": "merge",
				"name": "AttachmentList",
				"values": {
					"columns": [
						{
							"id": "1fc80a82-47d8-433a-8777-8c7874b9591b",
							"code": "AttachmentListDS_Name",
							"caption": "#ResourceString(AttachmentListDS_Name)#",
							"dataValueType": 28,
							"width": 200
						}
					]
				}
			},
			{
				"operation": "insert",
				"name": "UsrName",
				"values": {
					"layoutConfig": {
						"column": 1,
						"row": 1,
						"colSpan": 1,
						"rowSpan": 1
					},
					"type": "crt.Input",
					"label": "$Resources.Strings.UsrName",
					"control": "$UsrName",
					"labelPosition": "auto"
				},
				"parentName": "SideAreaProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrOTCSObjId",
				"values": {
					"layoutConfig": {
						"column": 1,
						"row": 2,
						"colSpan": 1,
						"rowSpan": 1
					},
					"type": "crt.Input",
					"label": "$Resources.Strings.PDS_UsrOTCSObjId_rsjzvms",
					"labelPosition": "auto",
					"control": "$PDS_UsrOTCSObjId_rsjzvms",
					"multiline": false
				},
				"parentName": "SideAreaProfileContainer",
				"propertyName": "items",
				"index": 1
			}
		]/**SCHEMA_VIEW_CONFIG_DIFF*/,
		viewModelConfigDiff: /**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"path": [
					"attributes"
				],
				"values": {
					"UsrName": {
						"modelConfig": {
							"path": "PDS.UsrName"
						}
					},
					"PDS_UsrOTCSObjId_rsjzvms": {
						"modelConfig": {
							"path": "PDS.UsrOTCSObjId"
						}
					}
				}
			},
			{
				"operation": "merge",
				"path": [
					"attributes",
					"Id",
					"modelConfig"
				],
				"values": {
					"path": "PDS.Id"
				}
			}
		]/**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/,
		modelConfigDiff: /**SCHEMA_MODEL_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"path": [],
				"values": {
					"primaryDataSourceName": "PDS"
				}
			},
			{
				"operation": "merge",
				"path": [
					"dataSources"
				],
				"values": {
					"PDS": {
						"type": "crt.EntityDataSource",
						"config": {
							"entitySchemaName": "UsrPetolTest"
						},
						"scope": "page"
					}
				}
			}
		]/**SCHEMA_MODEL_CONFIG_DIFF*/,
		handlers: /**SCHEMA_HANDLERS*/[
			{
				request: "crt.SaveRecordRequest",
				handler: async (request, next) => {
				  // const configuration = {
				  //   OTCS_url: "http://192.168.8.43/otcs/cs.exe",
				  //   OTCS_username: "admin",
				  //   OTCS_password: "P@ssw0rd",
				  //   OTCS_create_workspace_body: {
				  //     template_id: 1746616,
				  //     parent_id: 1746610,
				  //     roles: {
				  //       categories: {
				  //         1746611: {
				  //           "1746611_2": "Test12",
				  //           "1746611_3": "324234-234-324234",
				  //         },
				  //       },
				  //     },
				  //   },
				  // };
				  // const configuration = {
				  //   OTCS_url: "https://mgsdev.uaenorth.cloudapp.azure.com/otcs/cs.exe",
				  //   OTCS_username: "admin",
				  //   OTCS_password: "P@ssw0rd@MGS@2024",
				  //   OTCS_create_workspace_body: {
				  //     template_id: 301189,
				  //     parent_id: 302725,
				  //     roles: {
				  //       categories: {
				  //         302721: {
				  //           "302721_2": "test324234",
				  //           "302721_6": "43543",
				  //           "302721_7": "324",
				  //           "302721_8": "2024-10-02",
				  //           "302721_9": "dfg34",
				  //           "302721_3": ["الجامعة العربية"],
				  //           "302721_4": [
				  //             "Mediterranean Sea and Gulf for Computer Systems",
				  //             "البنك المركزي السعودي",
				  //           ],
				  //           "302721_5": "dsfds",
				  //           "302721_11": "000hh337646/ د",
				  //         },
				  //       },
				  //     },
				  //   },
				  // };
		
				  const objectName = await request.$context.UsrName;


				  const configuration = {
					OTCS_url: "http://192.168.17.128/otcs/cs.exe",
					OTCS_username: "admin",
					OTCS_password: "livelink",
					OTCS_create_workspace_body: {
					  template_id: 9142,
					  parent_id: 8812,
					  roles: {
						categories: {
						  9362: {
							"9362_2": objectName,
							"9362_3": "32423gfd34-234-324234",
						  },
						},
					  },
					},
					creatio_OTCSObjId: "PDS_UsrOTCSObjId_rsjzvms",
				  };

				  const OTCSObjId = await request.$context[`${configuration.creatio_OTCSObjId}`];


				  if(OTCSObjId){
					return next?.handle(request);
				  }

				  
		
				  try {
					const httpClientService = new sdk.HttpClientService();
		
					const authEndpoint = `${configuration.OTCS_url}/api/v1/auth`;
		
					const formData = new FormData();
					formData.append("username", configuration.OTCS_username);
					formData.append("password", configuration.OTCS_password);
		
					const authOptions = {
					  headers: {},
					  responseType: "json",
					};
		
					const authResponse = await httpClientService.post(
					  authEndpoint,
					  formData,
					  authOptions
					);
		
					let authToken = authResponse.body.ticket;
		
					const workspaceEndpoint = `${configuration.OTCS_url}/api/v2/businessworkspaces`;
		
					const workspaceRequestBody = JSON.stringify(
					  configuration.OTCS_create_workspace_body
					);
		
					const workspaceParams = new URLSearchParams();
					workspaceParams.append("body", workspaceRequestBody);
		
					const workspaceHeaders = {
					  "Content-Type": "application/x-www-form-urlencoded",
					  OTCSTicket: authToken,
					};
		
					const workspaceOptions = {
					  headers: workspaceHeaders,
					  body: workspaceParams.toString(),
					};
		
					const workspaceResponse = await httpClientService.post(
					  workspaceEndpoint,
					  workspaceParams.toString(),
					  workspaceOptions
					);
		
					request.$context[`${configuration.creatio_OTCSObjId}`] =
					  workspaceResponse.body.results.id;
		
					return next?.handle(request);
				  } catch (error) {
					window.alert(
					  `An error occurred while creating the business workspace in content server.`
					);
					console.error("Error creating business workspace:", error);
				  }
				},
			  }

			
		]/**SCHEMA_HANDLERS*/,
		converters: /**SCHEMA_CONVERTERS*/{}/**SCHEMA_CONVERTERS*/,
		validators: /**SCHEMA_VALIDATORS*/{}/**SCHEMA_VALIDATORS*/
	};
});