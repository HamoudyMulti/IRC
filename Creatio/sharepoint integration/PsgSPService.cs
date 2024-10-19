 
namespace PsiogSharePointConnector.Files.cs.SPWebServices
{
	using System;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;
	using SPCoreServicesNamespace.API;
	using System.Web.SessionState;
	using Common.Logging;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class PsgSpService : BaseService, IReadOnlySessionState
	{
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

		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public bool IsSpConfiguredForSection(string sectionName)
		{

			try
			{
				return PsgSPSCore.IsSpConfiguredForSection(sectionName);
			}
			catch (Exception e)
			{
				ILog logger = LogManager.GetLogger("SPService");
				logger.Error("Exception in PsgSpService" + e.ToString());
			}
			return false;
		}



	}
}
