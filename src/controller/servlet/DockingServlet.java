package controller.servlet;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.vertx.java.core.Vertx;


import controller.ContentsController;
import controller.DockingEnvironmentController;
import controller.EditorController;
import controller.EmailController;
import controller.JoinedMemberController;
import controller.LogInOutController;
import controller.MemberContentsController;
import controller.MemberController;
import controller.TempController;
import controller.action.ModifyAction;
import controller.action.SearchAction;

import socketIO.SocketIO;
import util.Injector;
import util.SocketPortManager;
import vo.ContentsVO;
import vo.MemberVO;

@WebServlet(name="DockingServlet", urlPatterns={"/addEditor","/getStartPage","/getData", "/joinedMember",
		"/login","/logout", "/emailChk",
		"/member_add", "/member_modify", "/member_search", "/member_searchAll", "/member_delete",
		"/contents_add", "/contents_modify", "/contents_search", "/contents_searchAll", "/contents_delete",
		"/temp_add", "/temp_modify", "/temp_search", "/temp_searchAll", "/temp_delete",
		"/joinedmember_add", "/joinedmember_modify", "/joinedmember_search", "/joinedmember_searchAll", "/joinedmember_delete",
		"/dockingEnvironment_add", "/dockingEnvironment_modify", "/dockingEnvironment_search", "/dockingEnvironment_searchAll", "/dockingEnvironment_delete",
		"/memberContents_search","/startSocket"
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
		
		if(action.equals("joinedMember")){
			joinedMember(req,res);
		}
		else if(action.equals("emailChk")){
			this.emailChk(req, res);
		}

		/**
		 * Editor source
		 */
		else if (action.equals("addEditor")) {
			this.addEditor(req,res);
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
		 * ContentsRequest
		 */
		else if(action.equals("contents_add")){
			this.contentsAdd(req,res);
		}

		else if(action.equals("contents_modify")){
			this.contentsModify(req,res);
		}

		else if(action.equals("contents_search")){
			this.contentsSearch(req,res);
		}

		else if(action.equals("contents_searchAll")){
			this.contentsSearchAll(req,res);
		}

		else if(action.equals("contents_delete")){
			this.contentsDelete(req,res);
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
		 * JoinedMemberRequest
		 */
		else if(action.equals("joinedmember_add")){
			this.joinedMemberAdd(req,res);
		}

		else if(action.equals("joinedmember_modify")){
			this.joinedMemberModify(req,res);
		}

		else if(action.equals("joinedmember_search")){
			this.joinedMemberSearch(req,res);
		}

		else if(action.equals("joinedmember_searchAll")){
			this.joinedMemberSearchAll(req,res);
		}

		else if(action.equals("joinedmember_delete")){
			this.joinedMemberDelete(req,res);
		}

		/**
		 * DockingEnvironmentRequest
		 */
		else if(action.equals("dockingEnvironment_add")){
			this.dockingEnvironmentAdd(req,res);
		}

		else if(action.equals("dockingEnvironment_modify")){
			this.dockingEnvironmentModify(req,res);
		}

		else if(action.equals("dockingEnvironment_search")){
			this.dockingEnvironmentSearch(req,res);
		}

		else if(action.equals("dockingEnvironment_searchAll")){
			this.dockingEnvironmentSearchAll(req,res);
		}

		else if(action.equals("dockingEnvironment_delete")){
			this.dockingEnvironmentDelete(req,res);
		}
		
		else if(action.equals("memberContents_search")){
			this.memberContentsSearch(req,res);
		}
		else if(action.equals("startSocket")){
			this.startSocket(req,res);
		}

		if((String)req.getAttribute("dispatchUrl") != null){
			RequestDispatcher	rd = req.getRequestDispatcher((String)req.getAttribute("dispatchUrl"));
			rd.forward(req, res);
		}
	}

	private void addEditor(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		EditorController con = (EditorController)Injector.getInstance().getObject(EditorController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.addEditor();
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

	//////////////////////////////////////////////////// ContentsRequest ////////////////////////////////////////////////////

	private void contentsAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		ContentsController con = (ContentsController)Injector.getInstance().getObject(ContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.contentsAdd();
	}

	private void contentsModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		ContentsController con = (ContentsController)Injector.getInstance().getObject(ContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.contentsModify();
	}

	private void contentsSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		ContentsController con = (ContentsController)Injector.getInstance().getObject(ContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.contentsSearch();
	}

	private void contentsSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		ContentsController con = (ContentsController)Injector.getInstance().getObject(ContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.contentsSearchAll();
	}

	private void contentsDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		ContentsController con = (ContentsController)Injector.getInstance().getObject(ContentsController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.contentsDelete();
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

	//////////////////////////////////////////////////// JoinedMemberRequest ////////////////////////////////////////////////////

	private void joinedMemberAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		JoinedMemberController con = (JoinedMemberController)Injector.getInstance().getObject(JoinedMemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.joinedMemberAdd();
	}

	private void joinedMember(HttpServletRequest req, HttpServletResponse res)	throws ServletException, IOException
	{
		JoinedMemberController con = (JoinedMemberController)Injector.getInstance().getObject(JoinedMemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.joinedMember();
	}

	private void joinedMemberModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		JoinedMemberController con = (JoinedMemberController)Injector.getInstance().getObject(JoinedMemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.joinedMemberModify();
	}

	private void joinedMemberSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		JoinedMemberController con = (JoinedMemberController)Injector.getInstance().getObject(JoinedMemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.joinedMemberSearch();
	}

	private void joinedMemberSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		JoinedMemberController con = (JoinedMemberController)Injector.getInstance().getObject(JoinedMemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.joinedMemberSearchAll();
	}

	private void joinedMemberDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		JoinedMemberController con = (JoinedMemberController)Injector.getInstance().getObject(JoinedMemberController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.joinedMemberDelete();
	}

	//////////////////////////////////////////////////// DockingEnvironmentRequest ////////////////////////////////////////////////////

	private void dockingEnvironmentAdd(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{	
		DockingEnvironmentController con = (DockingEnvironmentController)Injector.getInstance().getObject(DockingEnvironmentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.dockingEnvironmentAdd();
	}

	private void dockingEnvironmentModify(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DockingEnvironmentController con = (DockingEnvironmentController)Injector.getInstance().getObject(DockingEnvironmentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.dockingEnvironmentModify();
	}

	private void dockingEnvironmentSearch(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DockingEnvironmentController con = (DockingEnvironmentController)Injector.getInstance().getObject(DockingEnvironmentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.dockingEnvironmentSearch();
	}

	private void dockingEnvironmentSearchAll(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DockingEnvironmentController con = (DockingEnvironmentController)Injector.getInstance().getObject(DockingEnvironmentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.dockingEnvironmentSearchAll();
	}

	private void dockingEnvironmentDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		DockingEnvironmentController con = (DockingEnvironmentController)Injector.getInstance().getObject(DockingEnvironmentController.class);
		con.setRequest(req);
		con.setResponse(res);
		con.dockingEnvironmentDelete();
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
		String docId = req.getParameter("docId");
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		ContentsVO cvo = searchAction.searchContents("contents_search", docId);
		String port = cvo.getPath();
		String body = cvo.getBody();
		
		cvo.setBody("test");
		
/*		// 테스트용
		port = null;*/

/*		if(port.equals("1")){
=======
		
		if(port.equals("1"))
		{
>>>>>>> b9f8d1a96d6640ff1268295c87db9d71f7c436eb
			port = String.valueOf(SocketPortManager.getInstance().getPort());
			cvo.setPath(port);
			modifyAction.modifyContents("contents_modify", cvo);
			SocketIO sio = new SocketIO();
			sio.setPort(Integer.valueOf(port));
			sio.start(Vertx.newVertx());
		}*/
		
		port = "9000";
		
		MemberVO mvo = (MemberVO) req.getSession().getAttribute("logInMember");
		req.setAttribute("memberId", mvo.getId());
		req.setAttribute("docId", docId);
		req.setAttribute("port", port);
		req.setAttribute("data", body);
		req.getRequestDispatcher("./html/editorStartTest.jsp").forward(req, res);
	}
}
