namespace Terrasoft.Configuration.OmniChatGPTIntegration
{
    using System;
    using System.ServiceModel;
    using System.ServiceModel.Web;
    using System.ServiceModel.Activation;
    using System.Net;
    using System.Collections.Generic;
    using Terrasoft.Core;
    using Terrasoft.Web.Common;
    using Terrasoft.Core.Entities;
    using global::Common.Logging;
    using System.IO;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Threading.Tasks;

    public class ChatGPTRequest
    {

        public string model { get; set; }
        public string user { get; set; }
        public List<ChatGPTMessage> messages { get; set; }
        public ChatGPTRequest(string Message, string SystemMessage)
        {

            this.model = "gpt-3.5-turbo";
            this.messages = new List<ChatGPTMessage>();
            if (SystemMessage != "")
            {

                this.messages.Add(new ChatGPTMessage(SystemMessage, "system"));
            }

            this.messages.Add(new ChatGPTMessage(Message));

        }
    }

    public class ChatGPTMessage
    {

        public string role { get; set; }
        public string content { get; set; }
        public ChatGPTMessage(string message, string role = "user")
        {

            this.role = role;
            this.content = message;

        }

    }



    public class ChatGPTResponse
    {

        public string id { get; set; }
        public string model { get; set; }
        public ChatGPTTokenUsageData usage { get; set; }
        public List<ChatGPTChoiceData> choices { get; set; }
    }

    public class ChatGPTTokenUsageData
    {

        public int prompt_tokens { get; set; }
        public int completion_tokens { get; set; }
        public int total_tokens { get; set; }

    }

    public class ChatGPTChoiceData
    {

        public ChatGPTChoiceDataMessage message { get; set; }

    }
    public class ChatGPTChoiceDataMessage
    {

        public string role { get; set; }
        public string content { get; set; }


    }

    public class SendRequestData
    {

        public string UserPrompt { get; set; }
        public string SystemPrompt { get; set; }
        public string MessageSuffix { get; set; }


    }

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class OmniChatGPTIntegrationService : BaseService
    {

        ILog Logger = LogManager.GetLogger(nameof(Terrasoft.Configuration.OmniChatGPTIntegration));

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json)]
        public string SendToChatGPTAsync(SendRequestData frontData)
        {

            ChatGPTRequest requestData = new ChatGPTRequest(frontData.UserPrompt, frontData.SystemPrompt);
            requestData.user = UserConnection.CurrentUser.Id.ToString();
            var Result = "Request sucessfully sent";
            var URL = "https://api.openai.com/v1/chat/completions";

            var task = Task.Run(() =>
            {
                var respon = "";
                WebResponse myResponse = null;
                var OpenAIToken = Core.Configuration.SysSettings.GetValue<String>(this.UserConnection, "OmniOpenAIToken", "");
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(URL);
                req.Method = "POST";
                req.Headers.Add("Authorization", "Bearer " + OpenAIToken);
                req.ContentType = "application/json";
                bool HasException = false;
                string jsonString = JsonSerializer.Serialize(requestData);

                using (var streamWriter = new StreamWriter(req.GetRequestStream()))
                {
                    streamWriter.Write(jsonString);
                }
                try
                {
                    myResponse = req.GetResponse();
                }
                catch (WebException e)
                {
                    HasException = true;
                    int StatusCode = (int)((HttpWebResponse)e.Response).StatusCode;
                    Result = StatusCode.ToString();

                }

                if (!HasException)
                {

                    var httpwebr = (HttpWebResponse)myResponse;


                    using (Stream stream = myResponse.GetResponseStream())
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {

                            respon = reader.ReadToEnd();

                        }
                    }
                    myResponse.Close();
                    Logger.Error(respon);
                    var Response = JsonSerializer.Deserialize<ChatGPTResponse>(respon);

                    Result = Response.choices[0].message.content;
                    MsgChannelUtilities.PostMessageToAll("OmniChatGPTMessage" + frontData.MessageSuffix, Result);

                }


            });



            return Result;

        }


        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json)]
        public string SendToChatGPT(SendRequestData frontData)
        {

            ChatGPTRequest requestData = new ChatGPTRequest(frontData.UserPrompt, frontData.SystemPrompt);
            requestData.user = UserConnection.CurrentUser.Id.ToString();
            var Result = "";
            var URL = "https://api.openai.com/v1/chat/completions";
            var respon = "";
            WebResponse myResponse = null;
            var OpenAIToken = Core.Configuration.SysSettings.GetValue<String>(this.UserConnection, "OmniOpenAIToken", "");
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(URL);
            req.Method = "POST";
            req.Headers.Add("Authorization", "Bearer " + OpenAIToken);
            req.ContentType = "application/json";
            bool HasException = false;
            string jsonString = JsonSerializer.Serialize(requestData);

            using (var streamWriter = new StreamWriter(req.GetRequestStream()))
            {
                streamWriter.Write(jsonString);
            }
            try
            {
                myResponse = req.GetResponse();
            }
            catch (WebException e)
            {
                HasException = true;
                int StatusCode = (int)((HttpWebResponse)e.Response).StatusCode;
                Result = StatusCode.ToString();

            }

            if (!HasException)
            {

                var httpwebr = (HttpWebResponse)myResponse;


                using (Stream stream = myResponse.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {

                        respon = reader.ReadToEnd();

                    }
                }
                myResponse.Close();
                Logger.Error(respon);
                var Response = JsonSerializer.Deserialize<ChatGPTResponse>(respon);

                Result = Response.choices[0].message.content;


            }



            return Result;

        }


    }
};