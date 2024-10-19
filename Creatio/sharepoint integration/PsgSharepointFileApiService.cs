 
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
using Terrasoft.Configuration.FileUpload;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PsiogSharePointConnector.Files.cs.SPWebServices
{
   
	

    #region Class: PsgSharePointFileApiService

    [DefaultServiceRoute, SspServiceRoute]
    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class PsgSharePointFileApiService : BaseService, IReadOnlySessionState
    { 

        #region Constructors: Public

        public PsgSharePointFileApiService() : base()
        {
            _fileUploadInfoFactory = GetFileUploadInfo;
        }

        public PsgSharePointFileApiService(UserConnection userConnection, FileRepository fileRepository,
                Func<Stream, Terrasoft.Configuration.FileUpload.IFileUploadInfo> fileUploadInfoFactory) : base(userConnection)
        {
            _fileRepository = fileRepository;
            _fileUploadInfoFactory = fileUploadInfoFactory;
        }

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

        #region Properties: Private

        private FileRepository _fileRepository;

        /// <summary>
        /// File manager.
        /// </summary>
        private FileRepository FileRepository
        {
            get
            {
                if (_fileRepository == null)
                {
                    _fileRepository = ClassFactory.Get<FileRepository>(
                        new ConstructorArgument("userConnection", UserConnection));
                }
                return _fileRepository;
            }
        }

        private readonly Func<Stream, Terrasoft.Configuration.FileUpload.IFileUploadInfo> _fileUploadInfoFactory;


        #endregion

        #region Methods: Private

        private Terrasoft.Configuration.FileUpload.IFileUploadInfo GetFileUploadInfo(Stream fileContent)
        {
            Terrasoft.Configuration.FileUpload.IFileUploadInfo fileUploadInfo = ClassFactory.Get<FileUploadInfo>(
                new ConstructorArgument("fileContent", fileContent),
#if NETSTANDARD2_0 // TODO CRM-46497
				new ConstructorArgument("request", HttpContext.Current.Request),
#else
                new ConstructorArgument("request", new System.Web.HttpRequestWrapper(System.Web.HttpContext.Current.Request)),
#endif
                new ConstructorArgument("storage", UserConnection.Workspace.ResourceStorage));
            return fileUploadInfo;
        }


        #endregion

        #region Methods: Public

        /// <summary>
        /// Uploads file.
        /// </summary>
        /// <param name="fileContent">File data stream.</param>
        /// <returns>Upload result.</returns>

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "UploadFileToSharePoint", ResponseFormat = WebMessageFormat.Json)]
        public ConfigurationServiceResponse UploadFileToSharePoint(Stream fileContent)
        {
            Terrasoft.Configuration.FileUpload.IFileUploadInfo fileUploadInfo = _fileUploadInfoFactory(fileContent);
            var response = new ConfigurationServiceResponse();
            try
            {
                fileUploadInfo.AdditionalParams.TryGetValue("isSpConfigured", out object isConfigured);
               
                if (bool.Parse(isConfigured.ToString()))
                {
                    string uploadResult = PsgSPSCore.Uploader(FileUploadConverter(fileUploadInfo)).Result;
                    if (uploadResult == "Ok")
                    {
                        response.Success = true;
                    }
                    else
                    {
                        throw new Exception(uploadResult);
                    }

                }
                else
                {
                    AddToDB(fileContent, fileUploadInfo.FileId, fileUploadInfo.FileName);
                }


            }
            catch (Exception ex)
            {
                ILog logger = LogManager.GetLogger("SPService");
                response.Exception = ex;
                response.Success = false;
                logger.Error("UploadFileToSharePoint Exception:" + ex.ToString());

            }
            return response;
        }
		
		[OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "UploadFileToSharePointFreedom", ResponseFormat = WebMessageFormat.Json)]
        public string UploadFileToSharePointFreedom(Stream fileContent)
        {		
			try{
				string uploadResult = PsgSPSCore.FreedomUploader(fileContent).Result;
				return uploadResult;
			}
			catch (Exception ex)
            {
                return ex.Message;
            }			
        }
		
		[OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "UploadFileToSharePointFreedomCustom", ResponseFormat = WebMessageFormat.Json)]
        public string UploadFileToSharePointFreedomCustom(Stream fileContent)
        {
			try{
				string uploadResult = PsgSPSCore.FreedomUploaderCustom(fileContent).Result;
				return uploadResult;
			}
			catch (Exception ex)
            {
                return ex.Message;
            }	
        }

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteFileFromSharePoint", ResponseFormat = WebMessageFormat.Json)]
        public string DeleteFileFromSharePoint(Stream FileDetails)
        {

            try
            {
                string res = PsgSPSCore.DeleteFromSharePoint(FileDetails).Result;
                return res;
            }
            catch (Exception ex)
            {
                ILog logger = LogManager.GetLogger("SPService");
                logger.Error("DeleteFileFromSharePoint Exception:" + ex.ToString());
                return ex.Message;
            }

        }

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "RetryUploadToSharePoint", ResponseFormat = WebMessageFormat.Json)]
        public string RetryUploadToSharePoint(Stream FileDetails)
        {
            try
            {
                string retryResult = PsgSPSCore.RetrySPUploadInternal(FileDetails).Result;
                return retryResult;

            }
            catch (Exception ex)
            {
                ILog logger = LogManager.GetLogger("SPService");
                logger.Error("Exception:" + ex.ToString());
                return ex.Message;
            }

        }
		
		[OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "RetryUploadToSharePointCustom", ResponseFormat = WebMessageFormat.Json)]
        public string RetryUploadToSharePointCustom(Stream FileDetails)
        {
            try
            {
                string retryResult = PsgSPSCore.RetrySPUploadFreedom(FileDetails).Result;
                return retryResult;

            }
            catch (Exception ex)
            {
                ILog logger = LogManager.GetLogger("SPService");
                logger.Error("Exception:" + ex.ToString());
                return ex.Message;
            }

        }

        private void AddToDB(Stream FileContent, Guid FileId, string FileName)
        {

            var response = new ConfigurationServiceResponse();
            FileApiService fas = new FileApiService();
            response = fas.UploadFile(FileContent);
            ILog logger = LogManager.GetLogger("SPService");
            
            if (response.Success)
            {
               
                PsgSPSCore.AddToFileLinkSchema(FileId, false, FileName);
            }

        }

        private SPFileInfo FileUploadConverter(Terrasoft.Configuration.FileUpload.IFileUploadInfo fileUploadInfo)
        {
            SPFileInfo SFI = new SPFileInfo();
            SFI.FileName = fileUploadInfo.FileName;
            SFI.Version = fileUploadInfo.Version;
            SFI.FileId = fileUploadInfo.FileId;
            SFI.TypeId = fileUploadInfo.TypeId;
            SFI.TotalFileLength = fileUploadInfo.TotalFileLength;
            SFI.EntitySchemaName = fileUploadInfo.EntitySchemaName;
            SFI.ParentColumnName = fileUploadInfo.ParentColumnName;
            SFI.ParentColumnValue = fileUploadInfo.ParentColumnValue;
            SFI.Data = fileUploadInfo.Content;

            return SFI;
        }



        #endregion
    }


    #endregion


}

