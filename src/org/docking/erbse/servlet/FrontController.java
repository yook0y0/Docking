package org.docking.erbse.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.controller.DockingController;
import org.docking.erbse.controller.DocumentController;
import org.docking.erbse.controller.EditorController;
import org.docking.erbse.controller.MemberController;
import org.docking.erbse.controller.ReviewController;
import org.docking.erbse.util.Injector;


@WebServlet(name="/FrontController", urlPatterns={
		
		"/memberAdd", "/memberModify", "/memberSearch", "/memberDelete", "/memberLogin", "/memberLogout", "/memberAddChk",

		"/editorAdd", "/editorModify", "/editorSearch", "/editorDelete","/ownEditorList","/editorCodeAdd","/editorCodeModify","/editorCodeSearch","/editorCodeDelete","/codeList",

		"/documentAdd", "/documentModify", "/documentDelete", "/documentSearch", "/ownDocumentList", "/joinDocumentList", "/contentAdd", "/contentModify", "/contentDelete", "/contentSearch", "/contentsList", "/memberInvite", "/memberExpel", "/memberPositionUpdate",
		
		"/reviewAdd", "/reviewModify", "/reviewSearch", "/reviewDelete", "/reviewList", "/reviewListByEditor", "/reviewListByWriter",

		"/editorTestExecute", "/editorExecute", "/getEditorCode"
})
public class FrontController extends HttpServlet 
{
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException 
	{
		this.process(req, res);
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException 
	{
		this.process(req, res);
	}
	
	private void process(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		req.setCharacterEncoding("UTF-8");
		res.setCharacterEncoding("UTF-8");
		String	uri = req.getRequestURI();
		int		lastIndex = uri.lastIndexOf("/");
		String	action = uri.substring(lastIndex + 1);

		System.out.println("action : " + action);
		/*
		 * MemberController
		 */
		if(action.equals("memberAdd"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberAdd();
		}
		else if(action.equals("memberModify"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberModify();
		}
		else if(action.equals("memberSearch"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberSearch();
		}
		else if(action.equals("memberDelete"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberDelete();
		}
		else if(action.equals("memberLogin"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberLogin();
		}
		else if(action.equals("memberLogout"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberLogout();
		}
		else if(action.equals("memberAddChk"))
		{
			MemberController mc = (MemberController)Injector.getInstance().getObject(MemberController.class);
			mc.setReq(req);
			mc.setRes(res);
			mc.memberAddChk();
		}
		
		/*
		 * EditorController
		 */
		else if(action.equals("editorAdd"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorAdd();
		}
		else if(action.equals("editorModify"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorModify();
		}
		else if(action.equals("editorSearch"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorSearch();
		}
		else if(action.equals("editorDelete"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorDelete();
		}
		else if(action.equals("ownEditorList"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.ownEditorList();
		}
		else if(action.equals("editorCodeAdd"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorCodeAdd();
		}
		else if(action.equals("editorCodeModify"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorCodeModify();
		}
		else if(action.equals("editorCodeSearch"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorCodeSearch();
		}
		else if(action.equals("editorCodeDelete"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.editorCodeDelete();
		}
		else if(action.equals("codeList"))
		{
			EditorController ec = (EditorController)Injector.getInstance().getObject(EditorController.class);
			ec.setReq(req);
			ec.setRes(res);
			ec.codeList();
		}
		
		/*
		 * DocumentController
		 */
		else if(action.equals("documentAdd"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.documentAdd();
		}
		else if(action.equals("documentModify"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.documentModify();
		}
		else if(action.equals("documentSearch"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.documentSearch();
		}
		else if(action.equals("documentDelete"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.documentDelete();
		}
		else if(action.equals("ownDocumentList"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.ownDocumentList();
		}
		else if(action.equals("joinDocumentList"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.joinDocumentList();
		}
		else if(action.equals("contentAdd"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.contentAdd();
		}
		else if(action.equals("contentModify"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.contentModify();
		}
		else if(action.equals("contentSearch"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.contentSearch();
		}
		else if(action.equals("contentDelete"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.contentDelete();
		}
		else if(action.equals("contentsList"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.contentsList();
		}
		else if(action.equals("memberInvite"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.memberInvite();
		}
		else if(action.equals("memberExpel"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.memberExpel();
		}
		else if(action.equals("memberPositionUpdate"))
		{
			DocumentController dc = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.memberPositionUpdate();
		}
		
		/*
		 * ReviewController
		 */
		else if(action.equals("reviewAdd"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewAdd();
		}
		else if(action.equals("reviewModify"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewModify();
		}
		else if(action.equals("reviewSearch"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewSearch();
		}
		else if(action.equals("reviewDelete"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewDelete();
		}
		else if(action.equals("reviewList"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewList();
		}
		else if(action.equals("reviewListByEditor"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewListByEditor();
		}
		else if(action.equals("reviewListByWriter"))
		{
			ReviewController rc = (ReviewController)Injector.getInstance().getObject(ReviewController.class);
			rc.setReq(req);
			rc.setRes(res);
			rc.reviewListByWriter();
		}
		
		/*
		 * DockingController
		 */
		else if(action.equals("editorTestExecute"))
		{
			DockingController dc = (DockingController)Injector.getInstance().getObject(DockingController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.editorTestExecute();
		}
		else if(action.equals("editorExecute"))
		{
			DockingController dc = (DockingController)Injector.getInstance().getObject(DockingController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.editorExecute();
		}
		else if(action.equals("getEditorCode"))
		{
			DockingController dc = (DockingController)Injector.getInstance().getObject(DockingController.class);
			dc.setReq(req);
			dc.setRes(res);
			dc.getEditorCode();
		}
	}
}
