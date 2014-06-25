package controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import controller.action.AddAction;
import controller.action.SearchAction;

import util.Injector;
import vo.DocumentVO;
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
	
	public void memberContentsAdd()	throws ServletException, IOException
	{
		String	docId = req.getParameter("docId");
		String	memberId = req.getParameter("memberId");
		
		MemberContentsVO mv = new MemberContentsVO();
		mv.setDocId(docId);
		mv.setMemberId(memberId);

		AddAction addAction = new AddAction();
		addAction.addMemberContents(mv);
		
		req.getRequestDispatcher("./startSocket?docId=" + docId + "&lastDate=0").forward(req, res);
	}
	
	public void memberContentsSearch() throws ServletException, IOException
	{
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String id = mvo.getId();
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<MemberContentsVO> mvoList = searchAction.searchMemberContentsList(id);


		DocumentVO dv = new DocumentVO();
		
		List<DocumentVO> dvList = new ArrayList<DocumentVO>();
		
		for(int i=0;i<mvoList.size();i++)
		{
			dv = searchAction.searchDocument(mvoList.get(i).getDocId());
			dvList.add(dv);
		}
		
		req.setAttribute("documentList", dvList);
		req.getRequestDispatcher("documentList.jsp").forward(req, res);
	}
}
