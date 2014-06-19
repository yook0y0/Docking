package controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import controller.action.SearchAction;

import util.Injector;
import vo.DockingEnvironmentVO;
import vo.MemberContentsVO;
import vo.MemberVO;

public class MemberContentsController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void memberContentsSearch() throws ServletException, IOException
	{
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String id = mvo.getId();
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<MemberContentsVO> mvoList = searchAction.searchMemberContentsList("memberContents_search", id);


		DockingEnvironmentVO dvo = new DockingEnvironmentVO();
		List<DockingEnvironmentVO> dvoList = new ArrayList<DockingEnvironmentVO>();
		for(int i=0;i<mvoList.size();i++){
			dvo = searchAction.searchDockingEnvironment("dockingEnvironment_search", mvoList.get(i).getDocId());
			dvoList.add(dvo);
		}
		
		req.setAttribute("contentsList", dvoList);
		req.getRequestDispatcher("./html/documentList.jsp").forward(req, res);
	}
}
