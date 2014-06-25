package controller;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.DocumentVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import controller.action.AddAction;
import controller.action.DeleteAction;
import controller.action.ModifyAction;
import controller.action.SearchAction;

public class DocumentController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req)
	{
		this.req = req;
	}

	public void setResponse(HttpServletResponse res)
	{
		this.res = res;
	}
	
	public void documentAdd() throws ServletException, IOException
	{	
		long 	time = System.currentTimeMillis();
		
		/*
		 * DockingEnvironmentVO
		 */
		String	docId = String.valueOf(time);
		String 	title = req.getParameter("docTitle");
		String	type = req.getParameter("docEditor");
		
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String	writer = mvo.getId();
		DocumentVO	dv = new DocumentVO();
		dv.setId(docId);
		dv.setWriter(writer);
		dv.setTitle(title);
		dv.setContent("");
		dv.setType(type);
		dv.setCreationDate(new Date(time));
		
		/*
		 * MemberContentsVO
		 */
		MemberContentsVO mv = new MemberContentsVO();
		mv.setDocId(docId);
		mv.setMemberId(writer);

		AddAction addAction = new AddAction();
		addAction.addDocument(dv);
		addAction.addMemberContents(mv);

		res.setCharacterEncoding("utf-8");
		res.getWriter().println("success");
		res.getWriter().flush();
	}

	public void documentModify() throws ServletException, IOException
	{
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		
		String id = req.getParameter("id");
		String writer = req.getParameter("writer");
		String title = req.getParameter("title");
		String content = req.getParameter("content");
		String type = req.getParameter("type");
		Date creationDate = Date.valueOf(req.getParameter("creationDate"));
		
		DocumentVO dvo = new DocumentVO();
		dvo.setId(id);
		dvo.setWriter(writer);
		dvo.setTitle(title);
		dvo.setContent(content);
		dvo.setType(type);
		dvo.setCreationDate(creationDate);
		
		modifyAction.modifyDocument(dvo);
		
		res.getWriter().print("modify success");
	}

	public void documentSearch() throws ServletException, IOException
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		String id = req.getParameter("docId");
		
		DocumentVO dv = searchAction.searchDocument(id);
		
		req.setAttribute("DocumentVO", dv);
		req.getRequestDispatcher("documentUpdate.jsp").forward(req, res);
	}

	public void documentSearchAll() throws ServletException, IOException
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String id = mvo.getId();
		
		List<DocumentVO> dvList = searchAction.searchDocumentList(id);
		
		req.setAttribute("documentList", dvList);
		req.getRequestDispatcher("documentManage.jsp").forward(req, res);
	}

	public void documentDelete() throws ServletException, IOException
	{
		String id = req.getParameter("id");
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.deleteDocument(id);
		
		res.getWriter().print("delete success");
	}

	public void documentUpdateView() throws ServletException, IOException
	{
		String id = req.getParameter("id");
		String writer = req.getParameter("writer");
		String title = req.getParameter("title");
		String content = req.getParameter("content");
		String type = req.getParameter("type");
		Date creationDate = Date.valueOf(req.getParameter("creationDate"));
		
		DocumentVO dvo = new DocumentVO();
		dvo.setId(id);
		dvo.setWriter(writer);
		dvo.setTitle(title);
		dvo.setContent(content);
		dvo.setType(type);
		dvo.setCreationDate(creationDate);
		
		req.setAttribute("dvo", dvo);
		req.getRequestDispatcher("documentUpdate.jsp").forward(req, res);
	}
}
