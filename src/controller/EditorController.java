package controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.EditorVO;
import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.filter.FileDeleteFilter;
import analysis.filter.FileUnzipFilter;
import analysis.filter.StringReplaceFilter;
import analysis.register.FilePathRegister;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import controller.action.AddAction;
import controller.action.SearchAction;

public class EditorController {

	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void addEditor() throws ServletException, IOException{

		String savePath = req.getServletContext().getRealPath("tmp/");

		int sizeLimit = 1024*1024*15;

		MultipartRequest multi = null;
		try {
			multi = new MultipartRequest(req, savePath, sizeLimit, "utf-8", new DefaultFileRenamePolicy());
		} catch (IOException e) {
			e.printStackTrace();
		}

		String name = "testName";
		String editorName = multi.getParameter("editor_name");
		String fileName = multi.getFilesystemName("editor_file");

		String path = savePath + "/" + fileName;

		/*
		 * address replace �ÿ��� �̸�,���̵���� �ٿ��� ��������
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

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		EditorVO[] evo = new EditorVO[type.length];

		/*
		 * path�� unique���� �Ǳ����� ���̵�,�̸��� �߰� �ʿ�
		 */

		addAction.tempConnect();
		for(int i=0;i<type.length;i++){
			evo[i] = new EditorVO();
			evo[i].setEditorName(editorName);
			evo[i].setPath(name + "/" + editorName + "/" + new String(type[i]));
			evo[i].setCode(new String(data[i]));

			addAction.tempAdd(evo[i]);
		}
		addAction.tempDisConnect();

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
	
	public void getStartPage() throws IOException 
	{
		String pName = req.getParameter("pName");
		String name = req.getParameter("name");
		String editorName = req.getParameter("editorName");


		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		ServletOutputStream o = null;
		try {
			o = res.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}

		EditorVO evo = searchAction.searchEditor("editorCode_search_editor_path",name + "/" + editorName + "/" + pName);

		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(evo.getCode().getBytes())); 
		int n = 0;

		byte[] buffer = new byte[1024];
		while((n=in.read(buffer, 0, 1024)) != -1) {
			o.write(buffer, 0, n);
		}

		o.close();
		in.close();
	}
	
	public void getData() throws IOException{

		String dat = req.getParameter("value");
		byte[] buffer = new byte[1024];
		ServletOutputStream o = null;
		try {
			o = res.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		EditorVO evo = searchAction.searchEditor("editorCode_search_editor_path", dat);

		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(evo.getCode().getBytes())); 
		int n = 0;
		while((n=in.read(buffer, 0, 1024)) != -1) {
			o.write(buffer, 0, n);
		}

		o.close();
		in.close();
	}
}
