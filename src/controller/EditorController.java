package controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.DocumentVO;
import vo.EditorCodeVO;
import vo.EditorVO;
import vo.MemberVO;
import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.filter.FileDeleteFilter;
import analysis.filter.FileUnzipFilter;
import analysis.filter.StringReplaceFilter;
import analysis.register.FilePathRegister;
import analysis.register.StringRegister;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import controller.action.AddAction;
import controller.action.DeleteAction;
import controller.action.ModifyAction;
import controller.action.SearchAction;

public class EditorController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void editorAdd() throws ServletException, IOException{

		String savePath = req.getServletContext().getRealPath("tmp/");
		new File(savePath).mkdir();
		
		int sizeLimit = 1024*1024*15;

		MultipartRequest multi = null;
		try {
			multi = new MultipartRequest(req, savePath, sizeLimit, "utf-8", new DefaultFileRenamePolicy());
		} catch (IOException e) {
			e.printStackTrace();
		}

		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String id = mvo.getId();
		String editorName = multi.getParameter("editor_name");
		String info = multi.getParameter("editor_info");
		String startPage = multi.getParameter("editor_startPage");
		String getMethod = multi.getParameter("editor_getMethod");
		String setMethod = multi.getParameter("editor_setMethod");
		String fileName = multi.getFilesystemName("editor_file");
		
		String path = savePath + "/" + fileName;

		/*
		 * address replace �ÿ��� �̸�,���̵���� �ٿ��� ��������
		 */
		DockingAnalyzer ds = new StringReplaceFilter(new StringReplaceFilter(new FileUnzipFilter(new FilePathRegister(path)),"src=\"./","src=\"./getData?value=" + editorName + "/"),"href=\"./","href=\"./getData?value=" + editorName + "/");
		try {
			ds.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) ds.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		
		/*
		 * path�� unique���� �Ǳ����� ���̵�,�̸��� �߰� �ʿ�
		 */
		
		EditorVO evo = new EditorVO();
		evo.setDirector(id);
		evo.setName(editorName);
		evo.setInfo(info);
		evo.setStartPage(startPage);
		evo.setGetMethod(getMethod);
		evo.setSetMethod(setMethod);
		System.out.println("evo : " + evo.toString());
		addAction.addEditor(evo);
		
		EditorCodeVO[] ecvo = new EditorCodeVO[type.length];
		addAction.tempConnect();
		for(int i=0;i<type.length;i++){
			ecvo[i] = new EditorCodeVO();
			ecvo[i].setEditor(editorName);
			ecvo[i].setBody(new String(data[i]));
			ecvo[i].setPath(editorName + "/" + new String(type[i]));
			addAction.tempAdd(ecvo[i]);
		}
		addAction.tempDisConnect();

		ds = null;
		ds = new FileDeleteFilter(new FilePathRegister(path));
		try {
			ds.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}

		req.getRequestDispatcher("start.jsp").forward(req, res);
	}
	
	public void getStartPage() throws IOException 
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		String docId = req.getParameter("docId");
		DocumentVO dv = searchAction.searchDocument(docId);
		String editor = dv.getType();
		
		ServletOutputStream o = null;
		try {
			o = res.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		EditorVO evo = searchAction.searchEditor(editor);
		EditorCodeVO ecvo = searchAction.searchEditorCode(editor + "/" + evo.getStartPage());
		
		String startPage = ecvo.getBody();
		DockingAnalyzer da = new StringReplaceFilter(new StringRegister(startPage),"</head>","<script>function data_get() {return "+evo.getGetMethod()+";};function data_set(data) {"+evo.getSetMethod()+";};</script></head>");
		
		try {
			da.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] data = dAttr.getData();
		
		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(data[0])); 
		int n = 0;
		byte[] buffer = new byte[1024];
		while((n=in.read(buffer, 0, 1024)) != -1) {
			o.write(buffer, 0, n);
		}

		o.close();
		in.close();
	}
	
	public void getData() throws IOException
	{
		String dat = req.getParameter("value");
		
		System.out.println("dat : " + dat);
		
		byte[] buffer = new byte[1024];
		ServletOutputStream o = null;
		try {
			o = res.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		EditorCodeVO ecvo = searchAction.searchEditorCode(dat);
		System.out.println("dat2 : " + dat);

		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(ecvo.getBody().getBytes())); 
		int n = 0;
		while((n=in.read(buffer, 0, 1024)) != -1) 
		{
			o.write(buffer, 0, n);
		}

		o.close();
		in.close();
	}

	
	public void editorModify() throws IOException {
		String director = req.getParameter("director");
		String name = req.getParameter("name");
		String info = req.getParameter("info");
		String startPage = req.getParameter("startPage");
		String getMethod = req.getParameter("getMethod");
		String setMethod = req.getParameter("setMethod");
		
		EditorVO evo = new EditorVO();
		evo.setDirector(director);
		evo.setName(name);
		evo.setInfo(info);
		evo.setStartPage(startPage);
		evo.setGetMethod(getMethod);
		evo.setSetMethod(setMethod);
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.modifyEditor(evo);
		
		res.getWriter().print("modify success");
	}

	public void editorDelete() throws IOException {
		String name = req.getParameter("name");
		
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		
		deleteAction.deleteEditor(name);
		deleteAction.deleteEditorCode(name);
		
		res.getWriter().print("delete success");
	}

	public void editorUpdateView() throws ServletException, IOException {
		String director = req.getParameter("director");
		String name = req.getParameter("name");
		String info = req.getParameter("info");
		String startPage = req.getParameter("startPage");
		String getMethod = req.getParameter("getMethod");
		String setMethod = req.getParameter("setMethod");
		
		EditorVO evo = new EditorVO();
		evo.setDirector(director);
		evo.setName(name);
		evo.setInfo(info);
		evo.setStartPage(startPage);
		evo.setGetMethod(getMethod);
		evo.setSetMethod(setMethod);
		
		req.setAttribute("evo", evo);
		req.getRequestDispatcher("editorUpdate.jsp").forward(req, res);
	}

	public void editorSearchAll() throws ServletException, IOException {
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String id = mvo.getId();
		
		List<EditorVO> evoList = searchAction.searchEditorList(id);
		
		req.setAttribute("evoList", evoList);
		req.getRequestDispatcher("editorManage.jsp").forward(req, res);
	}

}
