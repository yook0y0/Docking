package controller.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import controller.DocumentController;
import controller.EditorController;
import controller.EditorReviewController;
import controller.EmailController;
import controller.LogInOutController;
import controller.MemberContentsController;
import controller.MemberController;
import controller.TempController;
import controller.action.SearchAction;


import util.Injector;
import vo.MemberVO;
import vo.TempVO;

@WebServlet(name="DockingServlet", urlPatterns={

		"/editor_add","/editor_modify","/editor_updateView","/editor_delete","/editor_searchAll",
		
		"/editorCode_list", "/editorCode_search", "/editorCode_Load", "/editorCode_modify",

		"/getStartPage","/getData", "/joinedMember", 

		"/emailChk", "/duplicationCheck", "/inviteEmail",

		"/login","/logout",

		"/editorReview_add","/editorReview_modify","/editorReview_search","/editorReview_searchAll","/editorReview_delete","/editorReview_updateAll", "/editorReview_entire",

		"/member_add", "/member_modify", "/member_search", "/member_searchAll", "/member_delete",

		"/temp_add", "/temp_modify", "/temp_search", "/temp_searchAll", "/temp_delete",

		"/document_add", "/document_modify", "/document_search", "/document_searchAll", "/document_delete","/document_updateView", "/getAllEditor", "/getAllEditor2",

		"/memberContents_add", "/memberContents_search","/startSocket","/document_manage","/editor_init"
})
public class DockingServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		process(req,res);
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException 
	{
		process(req,res);
	}

	private void process(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{	
		req.setCharacterEncoding("UTF-8");
		String	uri = req.getRequestURI();
		int		lastIndex = uri.lastIndexOf("/");
		String	action = uri.substring(lastIndex + 1);

		req.setCharacterEncoding("utf-8");


		if(action.equals("emailChk"))
		{
			this.emailChk(req, res);
		}
		else if(action.equals("duplicationCheck"))
		{
			this.duplicationCheck(req, res);
		}
		else if(action.equals("inviteEmail"))
		{
			this.inviteEmail(req,res);
		}

		/**
		 * Editor source
		 */
		else if (action.equals("editor_add")) {
			this.editorAdd(req,res);
		}
		else if (action.equals("editor_modify")) {
			this.editorModify(req,res);
		}
		else if (action.equals("editor_delete")) {
			this.editorDelete(req,res);
		}
		else if (action.equals("editor_updateView")) {
			this.editorUpdateView(req,res);
		}
		else if (action.equals("editor_searchAll")) {
			this.editorSearchAll(req,res);
		}
		else if (action.equals("getStartPage")) {
			this.getStartPage(req, res);
		}
		else if (action.equals("getData")) {
			this.getData(req, res);
		}
		else if(action.equals("login")){
			this.login(req,res);
		}
		else if(action.equals("logout")){
			this.logout(req,res);
		}
		/*
		 * 
		 */
		else if(action.equals("editorReview_add")){
			this.editorReviewAdd(req,res);
		}
		else if(action.equals("editorReview_modify")){
			this.editorReviewModify(req,res);
		}
		else if(action.equals("editorReview_search")){
			this.editorReviewSearch(req,res);
		}
		else if(action.equals("editorReview_searchAll")){
			this.editorReviewSearchAll(req,res);
		}
		else if(action.equals("editorReview_delete")){
			this.editorReviewDelete(req,res);
		}
		else if(action.equals("editorReview_updateView")){
			this.editorReviewUpdateView(req, res);
		}
		else if(action.equals("editorReview_entire"))
		{
			this.editorReviewEntire(req,res);
		}

		/**
		 * MemberRequest
		 */
		else if(action.equals("member_add")){
			this.memberAdd(req,res);
		}

		else if(action.equals("member_modify")){
			this.memberModify(req,res);
		}

		else if(action.equals("member_search")){
			this.memberSearch(req,res);
		}

		else if(action.equals("member_searchAll")){
			this.memberSearchAll(req,res);
		}

		else if(action.equals("member_delete")){
			this.memberDelete(req,res);
		}

		/**
		 * TempRequest
		 */
		else if(action.equals("temp_add")){
			this.tempAdd(req,res);
		}

		else if(action.equals("temp_modify")){
			this.tempModify(req,res);
		}

		else if(action.equals("temp_search")){
			this.tempSearch(req,res);
		}

		else if(action.equals("temp_searchAll")){
			this.tempSearchAll(req,res);
		}

		else if(action.equals("temp_delete")){
			this.tempDelete(req,res);
		}

		/**
		 * DockingEnvironmentRequest
		 */
		else if(action.equals("document_add")){
			this.documentAdd(req,res);
		}

		else if(action.equals("document_modify")){
			this.documentModify(req,res);
		}

		else if(action.equals("document_search")){
			this.documentSearch(req,res);
		}

		else if(action.equals("document_searchAll")){
			this.documentSearchAll(req,res);
		}

		else if(action.equals("document_delete")){
			this.documentDelete(req,res);
		}
		else if(action.equals("document_updateView")){
			this.documentUpdateView(req,res);
		}
		
		else if(action.equals("getAllEditor"))
		{
			this.getAllEditor(req,res);
		}
		
		else if(action.equals("getAllEditor2"))
		{
			this.getAllEditor2(req,res);
		}
		
		else if(action.equals("memberContents_add"))
		{
			this.memberContentsAdd(req,res);
		}

		else if(action.equals("memberContents_search")){
			this.memberContentsSearch(req,res);
		}
		else if(action.equals("startSocket")){
			this.startSocket(req,res);
		}
		else if(action.equals("editorCode_list")){
			this.editorCodeList(req,res);
		}
		else if(action.equals("editorCode_search")){
			this.editorCodeSearch(req,res);
		}
		else if(action.equals("editorCode_Load")){
			this.editorCodeLoad(req,res);
		}
		else if(action.equals("editorCode_modify")){
			this.editorCodeModify(req,res);
		}
		
		/*
		 * board
		 */

		if((String)req.getAttribute("dispatchUrl") != null){
			RequestDispatcher	rd = req.getRequestDispatcher((String)req.getAttribute("dispatchUrl"));
			rd.forward(req, res);
		}
	}
	
	private void editorCodeModify(HttpServletRequest req,
			HttpServletResponse res) throws IOException {
		// TODO Auto-generated method stub
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorCodeModify();
	}

	private void editorCodeLoad(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		// TODO Auto-generated method stub
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorCodeLoad();
	}

	private void editorCodeSearch(HttpServletRequest req,
			HttpServletResponse res) throws ServletException, IOException {
		// TODO Auto-generated method stub
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorCodeSearch();
	}

	private void editorCodeList(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		// TODO Auto-generated method stub
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorCodeList();
	}

	private void editorAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorAdd();
	}

	private void editorModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorModify();
	}

	private void editorDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorDelete();
	}

	private void editorUpdateView(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorUpdateView();
	}

	private void editorSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorSearchAll();
	}
	
	private void editorReviewEntire(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewEntire();
	}

	private void getStartPage(HttpServletRequest req, HttpServletResponse res) throws IOException 
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.getStartPage();
	}

	private void getData(HttpServletRequest req, HttpServletResponse res) throws IOException{

		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.getData();
	}

	private void emailChk(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EmailController con = (EmailController)Injector.getInstance().getObject(EmailController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.emailConfirm();
	}

	private void duplicationCheck(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EmailController con = (EmailController)Injector.getInstance().getObject(EmailController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.duplicationCheck();
	}

	private void inviteEmail(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EmailController con = (EmailController)Injector.getInstance().getObject(EmailController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.inviteEmail();
	}

	//////////////////////////////////////////////////// Login ////////////////////////////////////////////////////
	private void login(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		LogInOutController con = (LogInOutController)Injector.getInstance().getObject(LogInOutController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.login();
	}

	private void logout(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		LogInOutController con = (LogInOutController)Injector.getInstance().getObject(LogInOutController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.logout();
	}

	/*
	 * editorReview
	 */
	private void editorReviewAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorReviewController con = (EditorReviewController)Injector.getInstance().getObject(EditorReviewController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewAdd();
	}
	private void editorReviewModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorReviewController con = (EditorReviewController)Injector.getInstance().getObject(EditorReviewController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewModify();
	}
	private void editorReviewSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorReviewController con = (EditorReviewController)Injector.getInstance().getObject(EditorReviewController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewSearch();
	}
	private void editorReviewSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorReviewController con = (EditorReviewController)Injector.getInstance().getObject(EditorReviewController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewSearchAll();
	}
	private void editorReviewDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorReviewController con = (EditorReviewController)Injector.getInstance().getObject(EditorReviewController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewDelete();
	}
	
	private void editorReviewUpdateView(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorReviewController con = (EditorReviewController)Injector.getInstance().getObject(EditorReviewController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.editorReviewUpdateView();
	}

	//////////////////////////////////////////////////// MemberRequest ////////////////////////////////////////////////////
	private void memberAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{			
		MemberController con = (MemberController)Injector.getInstance().getObject(MemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberAdd();
	}

	private void memberModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		MemberController con = (MemberController)Injector.getInstance().getObject(MemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberModify();
	}

	private void memberSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		MemberController con = (MemberController)Injector.getInstance().getObject(MemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberSearch();
	}

	private void memberSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		MemberController con = (MemberController)Injector.getInstance().getObject(MemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberSearchAll();
	}

	private void memberDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		MemberController con = (MemberController)Injector.getInstance().getObject(MemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberDelete();
	}

	//////////////////////////////////////////////////// TempRequest ////////////////////////////////////////////////////

	private void tempAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		TempController con = (TempController)Injector.getInstance().getObject(TempController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.tempAdd();
	}

	private void tempModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		TempController con = (TempController)Injector.getInstance().getObject(TempController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.tempModify();
	}

	private void tempSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		TempController con = (TempController)Injector.getInstance().getObject(TempController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.tempSearch();
	}

	private void tempSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		TempController con = (TempController)Injector.getInstance().getObject(TempController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.tempSearchAll();
	}

	private void tempDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		TempController con = (TempController)Injector.getInstance().getObject(TempController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.tempDelete();
	}

	//////////////////////////////////////////////////// documentRequest ////////////////////////////////////////////////////

	private void documentAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{	
		DocumentController con = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.documentAdd();
	}

	private void documentModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DocumentController con = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.documentModify();
	}

	private void documentSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DocumentController con = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.documentSearch();
	}

	private void documentSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DocumentController con = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.documentSearchAll();
	}

	private void documentDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DocumentController con = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.documentDelete();
	}

	private void documentUpdateView(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DocumentController con = (DocumentController)Injector.getInstance().getObject(DocumentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.documentUpdateView();
	}
	
	private void getAllEditor(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.getAllEditor();
	}
	
	private void getAllEditor2(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.getAllEditor2();
	}
	
	private void memberContentsAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		MemberContentsController con = (MemberContentsController)Injector.getInstance().getObject(MemberContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberContentsAdd();
	}
	
	private void memberContentsSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		MemberContentsController con = (MemberContentsController)Injector.getInstance().getObject(MemberContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.memberContentsSearch();
	}

	private void startSocket(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		String 	id = req.getParameter("docId");
		String	tempLastDate = req.getParameter("lastDate");

		MemberVO mvo = (MemberVO) req.getSession().getAttribute("logInMember");
		req.setAttribute("memberId", mvo.getId());
		req.setAttribute("docId", id);
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		List<TempVO>	tempList = searchAction.searchTempByDocId(id);
		List<TempVO>	setTempList = new ArrayList<TempVO>();
		
		int	lastDate = Integer.parseInt(tempLastDate);
		
		if(tempList.size() != 0)
		{
			if(lastDate == 0)
			{
				for(TempVO vo : tempList)
				{
					if(vo.getCheckLast() > lastDate)
					{
						lastDate = vo.getCheckLast();
					}
				}
			}
			
			int	temp = lastDate - 10;
			
			for(TempVO vo : tempList)
			{
				if(vo.getCheckLast() > temp && vo.getCheckLast() <= lastDate)
				{
					setTempList.add(vo);
				}
			}
		}
		
		req.setAttribute("tempList", setTempList);
		req.getRequestDispatcher("editorStartTest.jsp").forward(req, res);
	}
}
