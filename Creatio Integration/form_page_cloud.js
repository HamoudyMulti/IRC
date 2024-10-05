define("UsrIntegrationTest_FormPage", /**SCHEMA_DEPS*/ [
  "@creatio-devkit/common",
  "UsrFrameComponent",
] /**SCHEMA_DEPS*/, function (/**SCHEMA_ARGS*/ sdk) /**SCHEMA_ARGS*/ {
  return {
    viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/ [
      {
        operation: "merge",
        name: "SaveButton",
        values: {
          size: "large",
          iconPosition: "only-text",
        },
      },
      {
        operation: "merge",
        name: "Tabs",
        values: {
          styleType: "default",
          mode: "tab",
          bodyBackgroundColor: "primary-contrast-500",
          selectedTabTitleColor: "auto",
          tabTitleColor: "auto",
          underlineSelectedTabColor: "auto",
          headerBackgroundColor: "auto",
        },
      },
      {
        operation: "merge",
        name: "GeneralInfoTabContainer",
        values: {
          gap: {
            columnGap: "large",
            rowGap: "none",
          },
          visible: true,
          color: "transparent",
          borderRadius: "none",
          padding: {
            top: "none",
            right: "none",
            bottom: "none",
            left: "none",
          },
          alignItems: "stretch",
        },
      },
      {
        operation: "merge",
        name: "CardToggleTabPanel",
        values: {
          styleType: "default",
          bodyBackgroundColor: "primary-contrast-500",
          selectedTabTitleColor: "auto",
          tabTitleColor: "auto",
          underlineSelectedTabColor: "auto",
          headerBackgroundColor: "auto",
        },
      },
      {
        operation: "merge",
        name: "Feed",
        values: {
          dataSourceName: "PDS",
          entitySchemaName: "UsrIntegrationTest",
        },
      },
      {
        operation: "merge",
        name: "AttachmentList",
        values: {
          columns: [
            {
              id: "cb4ea80c-a60a-3b06-a66c-2ca70aa9313e",
              code: "AttachmentListDS_Name",
              caption: "#ResourceString(AttachmentListDS_Name)#",
              dataValueType: 28,
            },
            {
              id: "d92b9913-4603-0473-036c-86727729e6a5",
              code: "AttachmentListDS_CreatedOn",
              caption: "#ResourceString(AttachmentListDS_CreatedOn)#",
              dataValueType: 7,
            },
            {
              id: "3ba9f375-1f54-bdff-0cb4-4411d60982dd",
              code: "AttachmentListDS_CreatedBy",
              caption: "#ResourceString(AttachmentListDS_CreatedBy)#",
              dataValueType: 10,
            },
            {
              id: "1113156b-34b4-2f01-8b6b-562924a5aba2",
              code: "AttachmentListDS_Size",
              caption: "#ResourceString(AttachmentListDS_Size)#",
              dataValueType: 4,
            },
          ],
        },
      },
      {
        operation: "insert",
        name: "UsrName",
        values: {
          layoutConfig: {
            column: 1,
            row: 1,
            colSpan: 1,
            rowSpan: 1,
          },
          type: "crt.Input",
          label: "$Resources.Strings.UsrName",
          control: "$UsrName",
          labelPosition: "auto",
        },
        parentName: "SideAreaProfileContainer",
        propertyName: "items",
        index: 0,
      },
      {
        operation: "insert",
        name: "OTCSObjId",
        values: {
          layoutConfig: {
            column: 1,
            row: 2,
            colSpan: 1,
            rowSpan: 1,
          },
          type: "crt.Input",
          label: "$Resources.Strings.PDS_UsrOTCSObjId_cn8cfdv",
          labelPosition: "auto",
          control: "$PDS_UsrOTCSObjId_cn8cfdv",
          multiline: false,
        },
        parentName: "SideAreaProfileContainer",
        propertyName: "items",
        index: 1,
      },
      {
        operation: "insert",
        name: "Input_IframeURL",
        values: {
          layoutConfig: {
            column: 1,
            row: 3,
            colSpan: 1,
            rowSpan: 1,
          },
          type: "crt.Input",
          label: "$Resources.Strings.PDS_UsrIframeURL_dgvsy8f",
          labelPosition: "auto",
          control: "$PDS_UsrIframeURL_dgvsy8f",
          multiline: false,
        },
        parentName: "SideAreaProfileContainer",
        propertyName: "items",
        index: 2,
      },
      {
        operation: "insert",
        name: "FrameComponent",
        values: {
          layoutConfig: {
            column: -14,
            row: 1,
            colSpan: 17,
            rowSpan: 19,
          },
          type: "usr.FrameComponent",
          src: `$PDS_UsrIframeURL_dgvsy8f,
        },
        parentName: "GeneralInfoTabContainer",
        propertyName: "items",
        index: 0,
      },
    ] /**SCHEMA_VIEW_CONFIG_DIFF*/,
    viewModelConfigDiff: /**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/ [
      {
        operation: "merge",
        path: ["attributes"],
        values: {
          UsrName: {
            modelConfig: {
              path: "PDS.UsrName",
            },
          },
          PDS_UsrOTCSObjId_cn8cfdv: {
            modelConfig: {
              path: "PDS.UsrOTCSObjId",
            },
          },
          PDS_UsrDescription_rfp9jhe: {
            modelConfig: {
              path: "PDS.UsrDescription",
            },
          },
          PDS_UsrIframeURL_dgvsy8f: {
            modelConfig: {
              path: "PDS.UsrIframeURL",
            },
          },
        },
      },
      {
        operation: "merge",
        path: ["attributes", "Id", "modelConfig"],
        values: {
          path: "PDS.Id",
        },
      },
    ] /**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/,
    modelConfigDiff: /**SCHEMA_MODEL_CONFIG_DIFF*/ [
      {
        operation: "merge",
        path: [],
        values: {
          primaryDataSourceName: "PDS",
        },
      },
      {
        operation: "merge",
        path: ["dataSources"],
        values: {
          PDS: {
            type: "crt.EntityDataSource",
            config: {
              entitySchemaName: "UsrIntegrationTest",
            },
            scope: "page",
          },
        },
      },
    ] /**SCHEMA_MODEL_CONFIG_DIFF*/,
    handlers: /**SCHEMA_HANDLERS*/ [
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
            creatio_OTCSObjId: "PDS_UsrOTCSObjId_cn8cfdv",
          };

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
      },
      {
        request: "crt.HandleViewModelInitRequest",
        /* The custom implementation of the system request handler. */
        handler: async (request, next) => {
          console.log("request.$context",request.$context)
          const OTCSObjId = await request.$context.PDS_UsrOTCSObjId_cn8cfdv; 

          console.log("OTCSObjId",OTCSObjId)

          request.$context.PDS_UsrIframeURL_dgvsy8f = `http://127.0.0.1:5500/Creatio%20Integration/integration.html?objId=${OTCSObjId}`;
            
          return next?.handle(request);
        },
    },
    ] /**SCHEMA_HANDLERS*/,
    converters: /**SCHEMA_CONVERTERS*/ {} /**SCHEMA_CONVERTERS*/,
    validators: /**SCHEMA_VALIDATORS*/ {} /**SCHEMA_VALIDATORS*/,
  };
});
