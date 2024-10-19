 
namespace PsiogSharePointConnector.Files.cs.SPWebServices
{
	
	using System;
	using System.IO;
	using System.ServiceModel;
	using System.ServiceModel.Activation;
	using System.ServiceModel.Web;
	using System.Web.SessionState;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;
	using SPCoreServicesNamespace.API;
	using Common.Logging;

	#region Class: FileService

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class PsgSPFileDownloadService : BaseService, IReadOnlySessionState
	{
		#region Constructors: Public

		public PsgSPFileDownloadService() : base()
		{

		}
		#endregion

		#region Properties: Private
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
		/// Download file
		/// </summary>
		/// <param name="fileId">file UId</param>
		/// <param name="fileName">File Name</param>
		//
		[OperationContract]
		[WebGet(RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare,
		ResponseFormat = WebMessageFormat.Json)]
		public Stream DownloadFile(string fileId, string fileName)
		{
			try
			{
				MemoryStream ms = PsgSPSCore.DownloadFile(fileId).Result;

				String headerInfo = "attachment; filename=" + fileName;

				WebOperationContext.Current.OutgoingResponse.Headers["Content-Disposition"] = headerInfo;

				WebOperationContext.Current.OutgoingResponse.ContentType = "application/octet-stream";

				return ms;
			}

			catch (Exception ex)
			{
				ILog logger = LogManager.GetLogger("SPService");
				logger.Info("DownloadFile Exception:" + ex.ToString());
				return null;
			}
		}
	
		#endregion

	}
	#endregion

}




