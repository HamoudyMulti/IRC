/* jshint esversion: 11 */
define("UsrOTCSIntegration_FormPage", /**SCHEMA_DEPS*/ [
  "@creatio-devkit/common",
] /**SCHEMA_DEPS*/, function (/**SCHEMA_ARGS*/ sdk) /**SCHEMA_ARGS*/ {
  return {
    viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/ [
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
        operation: "merge",
        name: "AttachmentList",
        values: {
          type: "crt.FileList",
          masterRecordColumnValue: "$Id",
          recordColumnName: "RecordId",
          layoutConfig: {
            colSpan: 2,
            column: 1,
            row: 1,
            rowSpan: 6,
          },
          items: "$AttachmentList",
          primaryColumnName: "AttachmentListDS_Id",
          columns: [
            {
              id: "ecc74969-4549-491b-8df1-8f16ad670e36",
              code: "AttachmentListDS_Name",
              caption: "#ResourceString(AttachmentListDS_Name)#",
              dataValueType: 28,
              width: 200,
            },
          ],
          viewType: "gallery",
          tileSize: "small",
        },
        parentName: "AttachmentsTabContainer",
        propertyName: "items",
        index: 0,
      },
      {
        operation: "merge",
        name: "Feed",
        values: {
          type: "crt.Feed",
          feedType: "Record",
          primaryColumnValue: "$Id",
          cardState: "$CardState",
          dataSourceName: "PDS",
          entitySchemaName: "UsrOTCSIntegration",
        },
        parentName: "FeedTabContainer",
        propertyName: "items",
        index: 0,
      },
    ] /**SCHEMA_VIEW_CONFIG_DIFF*/,
    viewModelConfig: /**SCHEMA_VIEW_MODEL_CONFIG*/ {
      attributes: {
        UsrName: {
          modelConfig: {
            path: "PDS.UsrName",
          },
        },
        Id: {
          modelConfig: {
            path: "PDS.Id",
          },
        },
      },
    } /**SCHEMA_VIEW_MODEL_CONFIG*/,
    modelConfig: /**SCHEMA_MODEL_CONFIG*/ {
      dataSources: {
        PDS: {
          type: "crt.EntityDataSource",
          config: {
            entitySchemaName: "UsrOTCSIntegration",
          },
          scope: "page",
        },
        AttachmentListDS: {
          type: "crt.EntityDataSource",
          scope: "viewElement",
          config: {
            entitySchemaName: "SysFile",
            attributes: {
              Name: {
                path: "Name",
              },
            },
          },
        },
      },
      primaryDataSourceName: "PDS",
    } /**SCHEMA_MODEL_CONFIG*/,
    handlers: /**SCHEMA_HANDLERS*/ [
      {
        request: "crt.SaveRecordRequest",
        handler: async (request, next) => {
          const configuration = {
            OTCS_url: "http://192.168.8.43/otcs/cs.exe",
            OTCS_username: "admin",
            OTCS_password: "P@ssw0rd",
            OTCS_create_workspace_body: {
              template_id: 1746616,
              parent_id: 1746610,
              roles: {
                categories: {
                  1746611: {
                    "1746611_2": "Test12",
                    "1746611_3": "324234-234-324234",
                  },
                },
              },
            },
          };

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

          const httpClientService = new sdk.HttpClientService();

          const authEndpoint = `${configuration.OTCS_url}/api/v1/auth`;

          const authParams = new FormData();
          authParams.append("username", configuration.OTCS_username);
          authParams.append("password", configuration.OTCS_password);

          const authOptions = {
            body: authParams,
          };

          let authToken = "";

          try {
            const authResponse = await httpClientService.post(
              authEndpoint,
              authOptions
            );

            if (authResponse.ok) {
              authToken = authResponse.headers.get("OTCSTicket");
              console.log("Authentication successful. Token:", authToken);
            } else {
              console.error(
                `Authentication failed. Status: ${authResponse.status}`
              );
              const errorData = await authResponse.json();
              console.error("Error details:", errorData);
              return next?.handle(request);
            }
          } catch (error) {
            console.error("Network error during authentication:", error);
            return next?.handle(request);
          }

          const workspaceEndpoint = `${configuration.OTCS_url}/api/v2/businessworkspaces`;

          const workspaceRequestBody = configuration.OTCS_create_workspace_body;

          const workspaceBody = JSON.stringify(workspaceRequestBody);

          const workspaceHeaders = {
            "Content-Type": "application/json",
            OTCSTicket: authToken,
          };

          const workspaceOptions = {
            headers: workspaceHeaders,
            body: workspaceBody,
          };

          try {
            const workspaceResponse = await httpClientService.post(
              workspaceEndpoint,
              workspaceOptions
            );

            if (workspaceResponse.ok) {
              const workspaceData = await workspaceResponse.json();
              console.log(
                "Business workspace created successfully:",
                workspaceData
              );
            } else {
              console.error(
                `Failed to create business workspace. Status: ${workspaceResponse.status}`
              );
              const errorData = await workspaceResponse.json();
              console.error("Error details:", errorData);
            }
          } catch (error) {
            console.error("Network error during workspace creation:", error);
          }

          return next?.handle(request);
        },
      },
    ],
    converters: /**SCHEMA_CONVERTERS*/ {} /**SCHEMA_CONVERTERS*/,
    validators: /**SCHEMA_VALIDATORS*/ {} /**SCHEMA_VALIDATORS*/,
  };
});
