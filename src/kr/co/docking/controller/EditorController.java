package kr.co.docking.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import kr.co.docking.action.AddAction;
import kr.co.docking.action.DeleteAction;
import kr.co.docking.action.ModifyAction;
import kr.co.docking.action.SearchAction;
import kr.co.docking.analysis.analysis.DockingAnalyzer;
import kr.co.docking.analysis.attribute.Attr;
import kr.co.docking.analysis.attribute.DataAttribute;
import kr.co.docking.analysis.filter.FileDeleteFilter;
import kr.co.docking.analysis.filter.FileUnzipFilter;
import kr.co.docking.analysis.register.FilePathRegister;
import kr.co.docking.util.Injector;
import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorVO;
import kr.co.docking.vo.MemberVO;

public class EditorController {
	private HttpServletRequest req;
	private HttpServletResponse res;
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}
	
	public void editorRegister() throws Exception 
	{
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		
		String savePath = req.getServletContext().getRealPath("tmp/");
		new File(savePath).mkdir();
		int sizeLimit = 1024*1024*15;

		MultipartRequest multi = null;
		try {
			multi = new MultipartRequest(req, savePath, sizeLimit, "utf-8", new DefaultFileRenamePolicy());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		String zipFileName = multi.getFilesystemName("zipFile");

		String editorId = multi.getParameter("editorId");
		//String director = multi.getParameter("director");
		String description = multi.getParameter("description");
		Integer editorType = Integer.valueOf(multi.getParameter("editorType"));		
		EditorVO evo = new EditorVO();
		evo.setEditorId(editorId);
		evo.setDirector(mvo.getMemberId());
		evo.setDescription(description);
		evo.setEditorType(editorType);
		
		String path = savePath + "/" + zipFileName;
		
		DockingAnalyzer ds = new FileUnzipFilter(new FilePathRegister(path));
		try {
			ds.analyze();
		} catch (Exception e) {
			e.printStackTrace();
		}

		DataAttribute dAttr = (DataAttribute) ds.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);		
		addAction.editorAdd(evo);

		EditorCodeVO ecvo = new EditorCodeVO();
		List<EditorCodeVO> ecvoList = new ArrayList<EditorCodeVO>();
		
		for(int i=0;i<data.length;i++){
			ecvo.setEditorId(editorId);
			ecvo.setCode(String.valueOf(data[i]));
			ecvo.setPath(editorId + "/" + String.valueOf(type[i]));
			ecvoList.add(ecvo);
		}
		addAction.editorCodeListAdd(ecvoList);
		
		ds = null;
		ds = new FileDeleteFilter(new FilePathRegister(path));
		ds.analyze();

		PrintWriter pw = res.getWriter();
		
		pw.write("EditorRegister");
		pw.flush();
	}
	
	public void editorModify() throws ServletException, IOException {
		EditorVO evo = new EditorVO();
		evo.setEditorId(req.getParameter("editorId"));
		evo.setDirector(req.getParameter("director"));
		evo.setDescription(req.getParameter("description"));
		evo.setEditorType(Integer.valueOf(req.getParameter("editorType")));
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.editorModify(evo);
		
		PrintWriter pw = res.getWriter();
		pw.println("editorModify");
		pw.flush();
	}
	
	public void editorSearch() throws ServletException, IOException {
		String editorId = req.getParameter("editorId");
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		EditorVO evo = searchAction.editorSearch(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.println("editorSearch");
		/*
		 * EditorVO ��������
		 */
		pw.flush();		
	}
	
	public void editorSearchAll() throws IOException {
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<EditorVO> ecvoList = searchAction.editorSearchAll();
		
		PrintWriter pw = res.getWriter();
		pw.println("editorSearchAll");
		/*
		 * EditorVO List ��������
		 */
		pw.flush();
	}
	
	public void editorSearchByDirector() throws IOException {
		String director = req.getParameter("director");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<EditorVO> ecvoList = searchAction.editorSearchByDirector(director);

		PrintWriter pw = res.getWriter();
		pw.write("editorSearchAllByKey");
		/*
		 * EditorVO List ��������
		 */
		pw.flush();
	}
	
	public void editorDelete() throws IOException {
		String editorId = req.getParameter("editorId");
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.editorDelete(editorId);
		deleteAction.editorCodeDeleteByEditorId(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorDelete");
		pw.flush();
	}
	
	public void editorDeleteAll() {
		/*
		 * �� �ɵ�
		 */
	}

	public void editorCodeRegister() throws IOException{
		EditorCodeVO ecvo = new EditorCodeVO();
		ecvo.setEditorId(req.getParameter("editorId"));
		ecvo.setCode(req.getParameter("code"));
		ecvo.setPath(req.getParameter("path"));
		
		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		addAction.editorCodeAdd(ecvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorCodeMoidfy");
		pw.flush();
	}
	
	public void editorCodeModify() throws IOException{		
		EditorCodeVO ecvo = new EditorCodeVO();
		ecvo.setEditorId(req.getParameter("editorId"));
		ecvo.setCode(req.getParameter("code"));
		ecvo.setPath(req.getParameter("path"));
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.editorCodeModify(ecvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorCodeMoidfy");
		pw.flush();
	}
	
	public void editorCodeSearch() throws IOException{
		String path = req.getParameter("path");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		EditorCodeVO ecvo = searchAction.editorCodeSearch(path);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorCodeSearch");
		/*
		 * EditorCodeVO ��������
		 */
		pw.flush();
	}
	
	public void editorCodeSearchByEditorId() throws IOException{
		String editorId = req.getParameter("editorId");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<EditorCodeVO> ecvoList = searchAction.editorCodeSearchByEditorId(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorCodeSearchByEditorId");
		/*
		 * EditorCodeVO List ��������
		 */
		pw.flush();		
	}
	
	public void editorCodeDelete() throws IOException{
		String path = req.getParameter("path");
		
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.editorCodeDelete(path);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorCodeDelete");
		pw.flush();
	}
}