
using Common.Logging;
using System;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Web.SessionState;
using Terrasoft.Configuration;
using SPCoreServicesNamespace.API;
using Terrasoft.Core;
using Terrasoft.Core.Factories;
using Terrasoft.Web.Common;
using Terrasoft.Web.Common.ServiceRouting;

namespace PsiogSharePointConnector.Files.cs.SPWebServices
{

    #region Class: PsgSharePointFileApiService

    [DefaultServiceRoute, SspServiceRoute]
    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class PsgSharePointDeveloperApiService : BaseService, IReadOnlySessionState
    {

        #region Constructors: Public      
        
        private SPCoreServices _psgSPSCore;

        private SPCoreServices PsgSPSCore
        {
            get
            {
                _psgSPSCore = ClassFactory.Get<SPCoreServices>(new ConstructorArgument("userConnection", UserConnection));
                return _psgSPSCore;
            }
        }

        #endregion

        #region Methods: Public

        /// <summary>
        /// Create Sharepoint folder structure.
        /// </summary>     

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "CreateSharePointFolderStructure", RequestFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        public CreateSPFolderResponse CreateSharePointFolderStructure(string EntitySchemaName, string EntityRecordId)
        {
            var response = new CreateSPFolderResponse();
            ILog logger = LogManager.GetLogger("SPService");
            try
            {
                if (!Guid.TryParse(EntityRecordId, out Guid entityRecordGuid))
                    throw new Exception("Entity Record Id is not valid Guid.");

                var result = PsgSPSCore.CreateSharePointFolderStructure(EntitySchemaName, entityRecordGuid).Result;
                if (result.Item1.Equals("Ok"))
                {
                    response.Success = true;
                    response.SharePointPath = result.Item2;
                }
                else
                {
                    response.Success = false;
                    response.Message = result.Item1;
                    response.SharePointPath = result.Item2;
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
                logger.Error("CreateSharePointFolderStructure Exception: " + ex.ToString());
            }
            return response;
        }

        #endregion
    }

    #endregion

    public class CreateSPFolderResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string SharePointPath { get; set; } = string.Empty;
    }

}