package controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.ContentsVO;
import vo.EditorVO;
import vo.MemberVO;
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
	
	public void addEditor() throws ServletException, IOException{

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
		String startPage = multi.getParameter("editor_startPage");
		String editorName = multi.getParameter("editor_name");
		String fileName = multi.getFilesystemName("editor_file");
		
		String path = savePath + "/" + fileName;

		/*
		 * address replace �ÿ��� �̸�,���̵���� �ٿ��� ��������
		 */
		DockingAnalyzer ds = new StringReplaceFilter(new FileUnzipFilter(new FilePathRegister(path)),"src=\"./","src=\"./getData?value=" + editorName + "/");
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
			evo[i].setId(id);
			evo[i].setEditorName(editorName);
			evo[i].setStartPage(startPage);
			evo[i].setPath(editorName + "/" + new String(type[i]));
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
	
	@SuppressWarnings("unchecked")
	public void getStartPage() throws IOException 
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		String docId = req.getParameter("docId");
		ContentsVO cvo = searchAction.searchContents("contents_search", docId);
		String editor = cvo.getType();
		
		ServletOutputStream o = null;
		try {
			o = res.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}

		EditorVO evo = searchAction.searchEditor("editorCode_search",editor);
		
		String startPage = evo.getStartPage();
		
		evo = searchAction.searchEditor("editorCode_search_editor_path", editor + "/" + startPage);
		
		/*
		 * 임시로
		 */
		List<EditorVO> evoList = searchAction.searchAllEditor("editorCode_searchAll");
		Map<String,String> evoMap = new HashMap<String,String>();
		for(int i=0;i<evoList.size();i++){
			if(evoList.get(i).getEditorName().equals(editor)){
				evoMap.put(evoList.get(i).getPath(), evoList.get(i).getCode());
			}
		}
		req.getSession().removeAttribute("editorSource");
		req.getSession().setAttribute("editorSource", evoMap);
		
		Map<String,String> eMap = (Map<String, String>) req.getSession().getAttribute("editorSource");
		
		BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(evo.getCode().getBytes())); 
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
		while((n=in.read(buffer, 0, 1024)) != -1) 
		{
			o.write(buffer, 0, n);
		}

		o.close();
		in.close();
	}
}
