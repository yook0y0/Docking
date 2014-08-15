package org.docking.erbse.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.service.EditorService;
import org.docking.erbse.util.Injector;
import org.docking.erbse.vo.EditorCodeVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;
import org.docking.erbse.vo.EditorVO;
import org.docking.erbse.vo.MemberVO;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

public class EditorController {
	private HttpServletRequest req;
	private HttpServletResponse res;
	private EditorService es;
	
	public EditorController(){
		this.req = null;
		this.res = null;
		this.es = (EditorService)Injector.getInstance().getObject(EditorService.class);
	}
	
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}
	
	public void editorAdd() throws IOException
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
		
		String zipFileName = multi.getFilesystemName("editorZip");
		
		String editorId = multi.getParameter("editorId");
		String director = ((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId();
		String description = multi.getParameter("description");
		Integer editorType = Integer.valueOf(multi.getParameter("editorType"));	
		
		String	startPage = multi.getParameter("startPage");
		String	setMethod = multi.getParameter("setMethod");
		String	getMethod = multi.getParameter("getMethod");
		Integer	useRange = Integer.valueOf(multi.getParameter("useRange"));
		
		EditorVO evo = new EditorVO();
		evo.setEditorId(editorId);
		evo.setDirector(director);
		evo.setDescription(description);
		evo.setEditorType(editorType);
		
		EditorExecuteInfoVO	eeivo = new EditorExecuteInfoVO();
		eeivo.setEditorId(editorId);
		eeivo.setGetMethod(getMethod);
		eeivo.setSetMethod(setMethod);
		eeivo.setStartPage(startPage);
		eeivo.setUseRange(useRange);
		
		String path = savePath + "/" + zipFileName;
		
		Integer code = es.editorAdd(path, evo, eeivo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorModify() throws IOException 
	{
		EditorVO evo = new EditorVO();
		evo.setEditorId(req.getParameter("editorId"));
		evo.setDirector(((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId());
		evo.setDescription(req.getParameter("description"));
		evo.setEditorType(Integer.valueOf(req.getParameter("editorType")));
		
		EditorExecuteInfoVO	eevo = new EditorExecuteInfoVO();
		eevo.setEditorId(req.getParameter("editorId"));
		eevo.setGetMethod(req.getParameter("getMethod"));
		eevo.setSetMethod(req.getParameter("setMethod"));
		eevo.setStartPage(req.getParameter("startPage"));
		eevo.setUseRange(Integer.valueOf(req.getParameter("useRange")));
		
		Integer code = es.editorModify(evo,eevo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorDelete() throws IOException 
	{
		String editorId = req.getParameter("editorId");
		
		Integer code = es.editorDelete(editorId);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void editorSearch() throws IOException 
	{
		String editorId = req.getParameter("editorId");

		String jRes = es.editorSearch(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void editorSearchAll() throws IOException 
	{
		String jRes = es.editorSearchAll();
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void ownEditorList() throws IOException 
	{
		String director = ((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId();

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
		
		Integer code = es.editorCodeAdd(ecvo);

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
	
	public void codeList() throws IOException
	{
		String editorId = req.getParameter("editorId");

		String jRes = es.codeList(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void childCodeList()	throws IOException
	{
		String	childId = req.getParameter("childId");
		String	editorId = req.getParameter("editorId");
		
		String jRes = es.childCodeList(childId,editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
}