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
import kr.co.docking.service.DocumentService;
import kr.co.docking.service.DocumentServiceImpl;
import kr.co.docking.service.EditorService;
import kr.co.docking.service.EditorServiceImpl;
import kr.co.docking.util.Injector;
import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorVO;
import kr.co.docking.vo.MemberVO;

public class EditorController {
	private HttpServletRequest req;
	private HttpServletResponse res;
	private EditorService es;
	
	public EditorController(){
		this.req = null;
		this.res = null;
		this.es = new EditorServiceImpl();
	}
	
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}
	
	public void editorAdd() throws Exception 
	{
		
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
		
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		EditorVO evo = new EditorVO();
		evo.setEditorId(editorId);
		evo.setDirector(mvo.getMemberId());
		evo.setDescription(description);
		evo.setEditorType(editorType);
		
		String path = savePath + "/" + zipFileName;
		
		Integer code = es.editorAdd(path, evo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorModify() throws ServletException, IOException {
		EditorVO evo = new EditorVO();
		evo.setEditorId(req.getParameter("editorId"));
		evo.setDirector(req.getParameter("director"));
		evo.setDescription(req.getParameter("description"));
		evo.setEditorType(Integer.valueOf(req.getParameter("editorType")));
		
		Integer code = es.editorModify(evo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorDelete() throws IOException {
		String editorId = req.getParameter("editorId");
		
		Integer code = es.editorDelete(editorId);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorSearch() throws ServletException, IOException {
		String editorId = req.getParameter("editorId");

		String jRes = es.editorSearch(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void ownEditorList() throws IOException {
		String director = req.getParameter("director");

		String jRes = es.ownEditorList(director);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}

	public void editorCodeAdd() throws IOException{
		EditorCodeVO ecvo = new EditorCodeVO();
		ecvo.setEditorId(req.getParameter("editorId"));
		ecvo.setCode(req.getParameter("code"));
		ecvo.setPath(req.getParameter("path"));
		
		Integer code = es.editorCodeAdd(evo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorCodeModify() throws IOException{		
		EditorCodeVO ecvo = new EditorCodeVO();
		ecvo.setEditorId(req.getParameter("editorId"));
		ecvo.setCode(req.getParameter("code"));
		ecvo.setPath(req.getParameter("path"));
		
		Integer code = es.editorCodeModify(ecvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorCodeSearch() throws IOException{
		String path = req.getParameter("path");
		
		String jRes = es.editorCodeSearch(path);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void editorCodeDelete() throws IOException{
		String path = req.getParameter("path");
		
		Integer code = es.editorCodeDelete(path);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void codeList() throws IOException{
		String editorId = req.getParameter("editorId");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<EditorCodeVO> ecvoList = searchAction.editorCodeSearchByEditorId(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write("editorCodeSearchByEditorId");
		/*
		 * EditorCodeVO List 占쏙옙占쏙옙占쏙옙占쏙옙
		 */
		pw.flush();
	}
}