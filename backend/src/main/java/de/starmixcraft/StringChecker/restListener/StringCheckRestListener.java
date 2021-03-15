package de.starmixcraft.StringChecker.restListener;

import de.starmixcraft.StringChecker.Main;
import de.starmixcraft.StringChecker.ckecker.CheckResponds;
import de.starmixcraft.restapi.common.request.HTTPRequest;
import de.starmixcraft.restapi.common.request.RequestType;
import de.starmixcraft.restapi.common.responds.HTTPResponds;
import de.starmixcraft.restapi.common.responds.RespondsCode;
import de.starmixcraft.restserver.dispatcher.AccessRestriction;
import de.starmixcraft.restserver.dispatcher.RestHandler;
import de.starmixcraft.restserver.dispatcher.RestListener;

public class StringCheckRestListener implements RestListener {

	
	
	@RestHandler(access = AccessRestriction.PUBLIC, type = RequestType.GET, value = "check")
	public HTTPResponds handel0(HTTPRequest r) {
		String toCheck = r.assertAndCast("message", String.class);
		boolean render = false;
		if(r.containsKey("render")) {
			render = true;
		}
		CheckResponds re = Main.checker.check(toCheck, true, true, true);
		return new HTTPResponds(RespondsCode.OK, render ? re.highlightToHTML() : re);
	}
}
