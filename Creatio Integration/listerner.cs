using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Terrasoft.Core;
using Terrasoft.Core.Entities;
using Terrasoft.Core.Entities.Events;
using Terrasoft.Core.Factories;
using Terrasoft.Core.Entities.AsyncOperations;

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Terrasoft.Core;
using Terrasoft.Core.Entities;
using Terrasoft.Core.Entities.Events;
using Terrasoft.Core.Factories;
using Terrasoft.Core.Entities.AsyncOperations;
using Terrasoft.Core.Entities.AsyncOperations.Interfaces;
using System.Collections.Immutable;

// Async Operation Class
public class CreateWorkspaceAsyncOperation : IEntityEventAsyncOperation
{
    public async void Execute(UserConnection userConnection, EntityEventAsyncOperationArgs arguments)
    {
        try
        {
            string workspaceName = arguments.EntityColumnValues["UsrName"]?.ToString();

            var configuration = new
            {
                OTCS_url = "http://192.168.17.128/otcs/cs.exe",
                OTCS_username = "admin",
                OTCS_password = "livelink",
                OTCS_create_workspace_body = new Dictionary<string, object>
                {
                    { "template_id", 9142 },
                    { "parent_id", 8812 },
                    { "roles", new Dictionary<string, object>
                        {
                            { "categories", new Dictionary<string, object>
                                {
                                    { "9362", new Dictionary<string, object>
                                        {
                                            { "9362_2", workspaceName },
                                            { "9362_3", "32423gfd34-234-324234" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                creatio_OTCSObjId = "UsrOTCSObjId"
            };

            using (var httpClient = new HttpClient())
            {
                var authToken = await AuthenticateWithOTCS(httpClient, configuration);
                var workspaceId = await CreateWorkspace(httpClient, authToken, configuration);

                Console.WriteLine($"Workspace created with ID: {workspaceId}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in async operation: {ex.Message}");
            throw;
        }
    }

    private async Task<string> AuthenticateWithOTCS(HttpClient httpClient, dynamic config)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{config.OTCS_url}/api/v1/auth");
        var content = new MultipartFormDataContent
        {
            { new StringContent(config.OTCS_username), "username" },
            { new StringContent(config.OTCS_password), "password" }
        };
        request.Content = content;

        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        var authResponse = JsonConvert.DeserializeObject<AuthResponse>(responseBody);

        if (authResponse == null || string.IsNullOrEmpty(authResponse.Ticket))
        {
            throw new Exception("Authentication failed. No ticket received.");
        }

        return authResponse.Ticket;
    }

    private async Task<string> CreateWorkspace(HttpClient httpClient, string authToken, dynamic config)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{config.OTCS_url}/api/v2/businessworkspaces");
        request.Headers.Add("OTCSTicket", authToken);

        var bodyContent = JsonConvert.SerializeObject(config.OTCS_create_workspace_body);
        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("body", bodyContent)
        });
        request.Content = content;

        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        dynamic responseJson = JsonConvert.DeserializeObject(responseBody);

        string id = responseJson?.results?.id;
        if (string.IsNullOrEmpty(id))
        {
            throw new Exception("Workspace ID not found in the response.");
        }

        return id;
    }

    public class AuthResponse
    {
        [JsonProperty("ticket")]
        public string Ticket { get; set; }
    }
}

// Entity Event Listener Class
[EntityEventListener(SchemaName = "UsrPetolTest")]
public class CustomEntityEventListener : BaseEntityEventListener
{
    public override void OnSaved(object sender, EntityAfterEventArgs e)
    {
        base.OnSaved(sender, e);

        var entity = (Entity)sender;
        var userConnection = entity.UserConnection;

        var operationArgs = new EntityEventAsyncOperationArgs(entity, e);

        var asyncExecutor = ClassFactory.Get<IEntityEventAsyncExecutor>(
            new ConstructorArgument("userConnection", userConnection));

        asyncExecutor.ExecuteAsync<CreateWorkspaceAsyncOperation>(operationArgs);
    }
}
