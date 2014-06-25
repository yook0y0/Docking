package controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
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
import analysis.filter.TokenDivisionFilter;
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
		String editorType = multi.getParameter("editor_type");
		
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
		
		EditorVO evo = new EditorVO();
		evo.setDirector(id);
		evo.setName(editorName);
		evo.setInfo(info);
		evo.setStartPage(startPage);
		evo.setGetMethod(getMethod);
		evo.setSetMethod(setMethod);
		evo.setEditorType(Integer.parseInt(editorType));
		System.out.println("evo : " + evo.toString());
		addAction.addEditor(evo);
		
		EditorCodeVO[] ecvo = new EditorCodeVO[type.length];
		addAction.tempConnect();
		for(int i=0;i<type.length;i++){
			ecvo[i] = new EditorCodeVO();
			ecvo[i].setEditor(editorName);
			ecvo[i].setBody(new String(data[i]));
			ecvo[i].setPath(editorName + "/" + new String(type[i]));
			System.out.println("ecvo : " + ecvo[i].toString());
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
		System.out.println("editor : " + editor);
		EditorVO evo = searchAction.searchEditor(editor);
		System.out.println("evo.toString() : " + evo.toString());
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
		
		DockingAnalyzer da = new TokenDivisionFilter(new StringRegister(dat),new String[]{"?","%"});
		try {
			da.analyze();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();
		
		dat = new String(data[0]).replace(new String(type[0]), "");
		
		dat = dat.replace("%", "");
		dat = dat.replace("?","");
		
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
	
public void editorCodeList() throws ServletException, IOException{
		
		String editor = req.getParameter("name");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<EditorCodeVO> ecvoList = searchAction.searchEditorCodeList(editor);

		String path = "";
		String type = "";
		int len = 0;
		
		List<EditorCodeVO> modifyList = new ArrayList<EditorCodeVO>();
		for(int i=0;i<ecvoList.size();i++){
			path = ecvoList.get(i).getPath();
			len = path.lastIndexOf('.');
			if(len > 0){
				type = path.substring(len+1,path.length());
			}
			else{
				type = "dir";
			}
			if(type.equals("html") || type.equals("css") || type.equals("js")){
				modifyList.add(ecvoList.get(i));
			}
		}
		
		req.setAttribute("editorCodeList", modifyList);
		req.getRequestDispatcher("editorCodeList.jsp").forward(req, res);
	}
	
	public void editorCodeSearch() throws ServletException, IOException {
		// TODO Auto-generated method stub
		String path = req.getParameter("path");
		req.setAttribute("path", path);
		req.getRequestDispatcher("./naverEditor.jsp").forward(req, res);
	}

	public void editorSearchAll() throws ServletException, IOException 
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String id = mvo.getId();
		
		List<EditorVO> evoList = searchAction.searchEditorList(id);
		
		req.setAttribute("evoList", evoList);
		req.getRequestDispatcher("editorManage.jsp").forward(req, res);
	}
	
	public void editorReviewEntire()	throws ServletException, IOException
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		req.setAttribute("entireEditorReview", searchAction.searchAllEditorReview());
		req.getRequestDispatcher("boardList.jsp").forward(req, res);
	}

	public void getAllEditor()	throws ServletException, IOException
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		req.setAttribute("allEditorList", searchAction.searchGetAllEditor());
		req.getRequestDispatcher("documentRegister.jsp").forward(req, res);
	}
	
	public void getAllEditor2()	throws ServletException, IOException
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		req.setAttribute("allEditorList", searchAction.searchGetAllEditor());
		req.getRequestDispatcher("boardRegister.jsp").forward(req, res);
	}
	
	public void editorCodeLoad() throws IOException {
		// TODO Auto-generated method stub
		String path = req.getParameter("path");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		EditorCodeVO ecvo = searchAction.searchEditorCode(path);
		String editorName = ecvo.getEditor();
		String body = ecvo.getBody();
		
/*		req.setAttribute("modifyCode", "<XMP> " + body + " </XMP>");*/
		
		DockingAnalyzer da = new StringReplaceFilter(new StringRegister(body),"src=\"./getData?value="+ editorName +"/","src=\"./");
		try {
			da.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();
		
		String r = new String(data[0]);
		
		r = r.replace("<", "&lt;");
		System.out.println("r : " + r);
		
		res.getWriter().print(r);
	}

	public void editorCodeModify() throws IOException {
		// TODO Auto-generated method stub
		String path = req.getParameter("path");
		String code = req.getParameter("code");
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		EditorCodeVO ecvo = searchAction.searchEditorCode(path);
		ecvo.setBody(code);
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.modifyEditorCode(ecvo);
		
		res.getWriter().print("modify success");
	}
}
