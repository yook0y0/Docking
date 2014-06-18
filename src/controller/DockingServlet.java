package controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.vertx.java.core.Vertx;

import SocketIO.SocketIO;
import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.filter.FileDeleteFilter;
import analysis.filter.FileUnzipFilter;
import analysis.filter.StringReplaceFilter;
import analysis.register.FilePathRegister;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;


import controller.service.DockingEnvironmentController;
import controller.service.EditorController;
import controller.service.JoinedMemberController;
import controller.service.MemberController;

import vo.DockingEnvironmentVO;
import vo.EditorVO;
import vo.JoinedMemberVO;
import vo.MemberVO;

@WebServlet(name="DockingServlet", urlPatterns={"/addEditor","/getStartPage","/getData",
		"/login",
		"/member_add", "/member_modify", "/member_search", "/member_searchAll", "/member_delete",
		"/contents_add", "/contents_modify", "/contents_search", "/contents_searchAll", "/contents_delete",
		"/temp_add", "/temp_modify", "/temp_search", "/temp_searchAll", "/temp_delete",
		"/joinedmember_add", "/joinedmember_modify", "/joinedmember_search", "/joinedmember_searchAll", "/joinedmember_delete",
		"/dockingEnvironment_add", "/dockingEnvironment_modify", "/dockingEnvironment_search", "/dockingEnvironment_searchAll", "/dockingEnvironment_delete"
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
		String	uri = req.getRequestURI();
		int		lastIndex = uri.lastIndexOf("/");
		String	action = uri.substring(lastIndex + 1);

		req.setCharacterEncoding("utf-8");

		if(action.equals("test"))
		{

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

		else if(action.equals("login"))
		{
			login(req,res);
		}

		/**
		 * MemberRequest
		 */
		else if(action.equals("member_add"))
		{
			memberAdd(req,res);
		}

		else if(action.equals("member_modify"))
		{
			memberModify(req,res);
		}

		else if(action.equals("member_search"))
		{
			memberSearch(req,res);
		}

		else if(action.equals("member_searchAll"))
		{
			memberSearchAll(req,res);
		}

		else if(action.equals("member_delete"))
		{
			memberDelete(req,res);
		}

		/**
		 * ContentsRequest
		 */
		else if(action.equals("contents_add"))
		{
			contentsAdd(req,res);
		}

		else if(action.equals("contents_modify"))
		{
			contentsModify(req,res);
		}

		else if(action.equals("contents_search"))
		{
			contentsSearch(req,res);
		}

		else if(action.equals("contents_searchAll"))
		{
			contentsSearchAll(req,res);
		}

		else if(action.equals("contents_delete"))
		{
			contentsDelete(req,res);
		}

		/**
		 * TempRequest
		 */
		else if(action.equals("temp_add"))
		{
			tempAdd(req,res);
		}

		else if(action.equals("temp_modify"))
		{
			tempModify(req,res);
		}

		else if(action.equals("temp_search"))
		{
			tempSearch(req,res);
		}

		else if(action.equals("temp_searchAll"))
		{
			tempSearchAll(req,res);
		}

		else if(action.equals("temp_delete"))
		{
			tempDelete(req,res);
		}

		/**
		 * JoinedMemberRequest
		 */
		else if(action.equals("joinedmember_add"))
		{
			joinedmemberAdd(req,res);
		}

		else if(action.equals("joinedmember_modify"))
		{
			joinedmemberModify(req,res);
		}

		else if(action.equals("joinedmember_search"))
		{
			joinedmemberSearch(req,res);
		}

		else if(action.equals("joinedmember_searchAll"))
		{
			joinedmemberSearchAll(req,res);
		}

		else if(action.equals("joinedmember_delete"))
		{
			joinedmemberDelete(req,res);
		}

		/**
		 * DockingEnvironmentRequest
		 */
		else if(action.equals("dockingEnvironment_add"))
		{
			dockingEnvironmentAdd(req,res);
		}

		else if(action.equals("dockingEnvironment_modify"))
		{
			dockingEnvironmentModify(req,res);
		}

		else if(action.equals("dockingEnvironment_search"))
		{
			dockingEnvironmentSearch(req,res);
		}

		else if(action.equals("dockingEnvironment_searchAll"))
		{
			dockingEnvironmentSearchAll(req,res);
		}

		else if(action.equals("dockingEnvironment_delete"))
		{
			dockingEnvironmentDelete(req,res);
		}

		if((String)req.getAttribute("dispatchUrl") != null)
		{
			RequestDispatcher	rd = req.getRequestDispatcher((String)req.getAttribute("dispatchUrl"));
			rd.forward(req, res);
		}
	}
	
	private void addEditor(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException{

		String savePath = req.getServletContext().getRealPath("tmp/");

		// 파일 크기 15MB로 제한
		int sizeLimit = 1024*1024*15;

		MultipartRequest multi = null;
		try {
			multi = new MultipartRequest(req, savePath, sizeLimit, "utf-8", new DefaultFileRenamePolicy());
		} catch (IOException e) {
			e.printStackTrace();
		}

		String name = "testName"/*multi.getParameter("director_name")*/;
		String editorName = multi.getParameter("editor_name");
		String fileName = multi.getFilesystemName("editor_file");

		// 업로드한 파일의 전체 경로를 DB에 저장하기 위함
		String path = savePath + "/" + fileName;

		/*
		 * address replace 시에도 이름,아이디등을 붙여서 만들어야함
		 */
		DockingAnalyzer ds = new StringReplaceFilter(new FileUnzipFilter(new FilePathRegister(path)),"src=\"./","src=\"./getData?value=" + name + "/" + editorName + "/");
		try {
			ds.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) ds.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();

		EditorController ec = new EditorController();
		EditorVO[] evo = new EditorVO[type.length];

		/*
		 * path가 unique값이 되기위한 아이디,이름등 추가 필요
		 */
		
		ec.tempConnect();
		for(int i=0;i<type.length;i++){
			evo[i] = new EditorVO();
			evo[i].setEditorName(editorName);
			evo[i].setPath(name + "/" + editorName + "/" + new String(type[i]));
			evo[i].setCode(new String(data[i]));
			
			ec.tempAdd("editorCode_add", evo[i]);
			
			System.out.println("# path : " + evo[i].getPath());
		}
		ec.tempDisConnect();
		
		ds = null;
		ds = new FileDeleteFilter(new FilePathRegister(path));
		try {
			ds.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		res.getWriter().print("success.");

/*		req.setAttribute("startPage",  "http://localhost:8089/Docking/getStartPage?name=" + name + "&editorName=" + editorName + "&pName=start.html");

		req.getRequestDispatcher("./html/editorStartTest.jsp").forward(req, res);*/
	}

	private void getStartPage(HttpServletRequest req, HttpServletResponse res) throws IOException {

		/*
		 * start.jsp 자체 path 저장시 이름,아이디등을 붙여서 만들어야함
		 */
		
		String pName = req.getParameter("pName");
		String name = req.getParameter("name");
		String editorName = req.getParameter("editorName");
		
		
		EditorController ec = new EditorController();
        ServletOutputStream o = null;
        try {
			o = res.getOutputStream();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        EditorVO evo = ec.search("editorCode_search_editor_path",name + "/" + editorName + "/" + pName);
        
        BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(evo.getCode().getBytes())); 
        int n = 0;
        
        byte[] buffer = new byte[1024];
        while((n=in.read(buffer, 0, 1024)) != -1) {
            o.write(buffer, 0, n);
        }

        o.close();
        in.close();
	}
	
	private void getData(HttpServletRequest req, HttpServletResponse res) throws IOException{

		String dat = req.getParameter("value");
		byte[] buffer = new byte[1024];
        ServletOutputStream o = null;
        try {
			o = res.getOutputStream();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		EditorController ec = new EditorController();
		EditorVO evo = ec.search("editorCode_search_editor_path", dat);
/*		List<EditorVO> evoList = ec.searchAll("editorCode_searchAll");
		*/
		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(evo.getCode().getBytes())); 
        int n = 0;
        while((n=in.read(buffer, 0, 1024)) != -1) {
            o.write(buffer, 0, n);
        }

        o.close();
        in.close();
		
		/*BufferedInputStream in = null;
		
		for(int i=0;i<evoList.size();i++){
			if(evoList.get(i).getPath().equals(dat)){
				in = new BufferedInputStream(new ByteArrayInputStream(evoList.get(i).getCode().getBytes()));
		        int n = 0;
		        
		        while((n=in.read(buffer, 0, 1024)) != -1) {
		            o.write(buffer, 0, n);
		        }

		        o.close();
		        in.close();
			}
		}*/
	}

	//////////////////////////////////////////////////// Login ////////////////////////////////////////////////////
	private void login(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		String	pw = request.getParameter("memberPw");

		String	sendMessage = "LOGIN SUCCESS!";

		HttpSession	session = null;

		MemberController	memberController = new MemberController();
		MemberVO	memberVO = memberController.search("member_search", id);

		if(memberVO != null)
		{
			if(memberVO.getPw().equals(pw))
			{
				session = request.getSession();

				session.setAttribute("logInMember", memberVO);
			}

			else
			{
				sendMessage = "LOGIN FAIL!";
			}
		}

		else
		{
			sendMessage = "LOGIN FAIL!";
		}

		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}


	//////////////////////////////////////////////////// MemberRequest ////////////////////////////////////////////////////
	private void memberAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{			
		String	id = request.getParameter("memberId");
		String	pw = request.getParameter("memberPw");
		String	nickName = request.getParameter("memberNickName");
		String	type = request.getParameter("memberType");

		String	sendMessage = "REGISTER FINISHED";

		HttpSession	session = null;

		MemberController	memberController = new MemberController();
		MemberVO	memberVO = new MemberVO();

		memberVO.setId(id);
		memberVO.setPw(pw);
		memberVO.setNickName(nickName);
		memberVO.setMemberType(Integer.parseInt(type));

		if(memberController.search("member_search", id) != null)
		{
			sendMessage = "ID DUPLICATION!!";
		}

		else
		{
			memberController.add("member_add", memberVO);

			session = request.getSession();

			session.setAttribute("logInMember", memberVO);
		}

		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}

	private void memberModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		String	pw = request.getParameter("memberPw");
		String	nickName = request.getParameter("memberNickName");
		String	type = request.getParameter("memberType");

		String	sendMessage = "MODIFY FINISHED";

		MemberController	memberController = new MemberController();
		MemberVO	memberVO = new MemberVO();

		memberVO.setId(id);
		memberVO.setPw(pw);
		memberVO.setNickName(nickName);
		memberVO.setMemberType(Integer.parseInt(type));

		memberController.modify("member_modify", memberVO);

		HttpSession	session = request.getSession();

		session.setAttribute("logInMember", memberVO);

		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}

	private void memberSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		
		String	foundId = null;
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = null;
		
		try
		{
			memberVO = memberController.search("member_search", id);
			
			foundId = memberVO.getId();
		}
		catch(RuntimeException e)
		{

		}
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(foundId);
		writer.flush();
	}

	private void memberSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		MemberController	memberController = new MemberController();

		List<MemberVO>	memberList = memberController.searchAll("member_searchAll");

		request.setAttribute("memberList", memberList);
		request.getRequestDispatcher("testResult.jsp").forward(request, response);
	}

	private void memberDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");

		String	sendMessage = "DELETE FINISHED";

		MemberController	memberController = new MemberController();

		memberController.delete("member_delete", id);

		HttpSession	session = request.getSession();

		session.removeAttribute("logInMember");

		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}

	//////////////////////////////////////////////////// ContentsRequest ////////////////////////////////////////////////////

	private void contentsAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	//////////////////////////////////////////////////// TempRequest ////////////////////////////////////////////////////

	private void tempAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	//////////////////////////////////////////////////// JoinedMemberRequest ////////////////////////////////////////////////////

	private void joinedmemberAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		String	docId = (String)getServletContext().getAttribute("docId");
		
		String	sendMessage = "Send Invite Message";
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = null;
		
		memberVO = memberController.search("member_search", id);
			
		try
		{
			JoinedMemberController	joinedMemberController = new JoinedMemberController();
			JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();
			
			joinedMemberVO.setKey(docId + "/" + memberVO.getId());
			joinedMemberVO.setDocId(docId);
			joinedMemberVO.setFlag(1);
			joinedMemberVO.setMemberId(memberVO.getId());
			
			joinedMemberController.add("joinedMember_add", joinedMemberVO);
			
			List<JoinedMemberVO>	joinedMemberList = joinedMemberController.searchJoinedMember("joinedMember_searchAll", docId);
			
			getServletContext().setAttribute("joinedMemberList", joinedMemberList);
		}
		catch(RuntimeException e)
		{
			sendMessage = "Already Invited Member!";
		}

		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(sendMessage);
		writer.flush();
	}

	private void joinedmemberModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void joinedmemberSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void joinedmemberSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void joinedmemberDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	//////////////////////////////////////////////////// DockingEnvironmentRequest ////////////////////////////////////////////////////

	private void dockingEnvironmentAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{	
		String	writerId = request.getParameter("writer");
		
		MemberVO	memberVO = new MemberController().search("member_search", writerId);
		
		DockingEnvironmentController	dockingEnvironmentController = new DockingEnvironmentController();
		DockingEnvironmentVO	dockingEnvironmentVO = new DockingEnvironmentVO();
		
		long 	time = System.currentTimeMillis(); 
		Date	date = new Date(time);
		
		dockingEnvironmentVO.setDocId(memberVO.getId() + "/" + time);
		dockingEnvironmentVO.setTitle(memberVO.getId());
		dockingEnvironmentVO.setCreationDate(date);
		dockingEnvironmentVO.setWriter(memberVO.getId());
		
		dockingEnvironmentController.add("dockingEnvironment_add", dockingEnvironmentVO);
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		JoinedMemberController	joinedMemberController = new JoinedMemberController();
		JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();
		
		joinedMemberVO.setKey(dockingEnvironmentVO.getDocId() + "/" + memberVO.getId());
		joinedMemberVO.setDocId(dockingEnvironmentVO.getDocId());
		joinedMemberVO.setFlag(1);
		joinedMemberVO.setMemberId(memberVO.getId());
		
		joinedMemberController.add("joinedMember_add", joinedMemberVO);
		
		List<JoinedMemberVO>	joinedMemberList = joinedMemberController.searchJoinedMember("joinedMember_searchAll", dockingEnvironmentVO.getDocId());
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		getServletContext().setAttribute("docId", dockingEnvironmentVO.getDocId());
		getServletContext().setAttribute("joinedMemberList", joinedMemberList);
		getServletContext().setAttribute("masterId", memberVO.getId());
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		SocketIO	socketIO = (SocketIO)getServletContext().getAttribute("socketIO");
		
		/*int		portNum = -(int)time;
		portNum %= 51000;
		
		List<Integer> li = new ArrayList<Integer>;
		
		for(int i=0;i<1000;i++){
			li.add(i);
		}
		// 컨텍스트에 li를 넣고
		
		Map<Integer,List<Integer>> m = null; // servletcontext에서 li 꺼내고
		// m에서 쓸수있는 포트 꺼냄
		
		// m에서 꺼낸 쓸수있는 포트를 쓸수없는거로 바꾸고
*/		
		
		
		
		socketIO.setPort(portNum);
		socketIO.start(Vertx.newVertx());
		
		getServletContext().setAttribute("portNum", portNum);
		
		System.out.println(portNum);
		
		/////////////////////////////////////////////////////////////////////////////////////////////
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(dockingEnvironmentVO.getDocId());
		writer.flush();
	}

	private void dockingEnvironmentModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void dockingEnvironmentSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void dockingEnvironmentSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void dockingEnvironmentDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}
}
