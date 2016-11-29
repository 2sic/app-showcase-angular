using DotNetNuke.Security;
using DotNetNuke.Web.Api;
using System.Web.Http;
using ToSic.SexyContent.WebApi;
using System.Linq;

public class ReferencesController : SxcApiController
{
	[HttpGet]
	[DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Anonymous)]
	public object GetImages(int entityId)
	{
		var reference = AsDynamic(App.Data["Reference"].List[entityId]);
        return AsAdam(reference, "Images").Files;
	}
    
}