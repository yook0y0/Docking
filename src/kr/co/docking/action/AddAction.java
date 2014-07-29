package kr.co.docking.action;

import java.util.List;

import kr.co.docking.dao.service.GenericService;
import kr.co.docking.dao.serviceImpl.GenericServiceImpl;
import kr.co.docking.vo.ContentVO;
import kr.co.docking.vo.DocumentVO;
import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorReviewBBSVO;
import kr.co.docking.vo.EditorVO;
import kr.co.docking.vo.MemberContentVO;
import kr.co.docking.vo.MemberVO;
import kr.co.docking.vo.TempVO;

public class AddAction
{
	public void documentAdd(DocumentVO document) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.add("document_add", document);
	}

	public void contentAdd(ContentVO content) 
	{		
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.add("content_add", content);
	}

	public void memberAdd(MemberVO member) 
	{	
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.add("member_add", member);
	}

	public void memberContentAdd(MemberContentVO memberContent) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.add("memberContent_add", memberContent);
	}

	public void tempAdd(TempVO temp) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.add("temp_add", temp);
	}

	public void editorAdd(EditorVO editor) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		genericService.add("editor_add", editor);
	}

	public void editorCodeAdd(EditorCodeVO editorCode)
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.add("editorCode_add", editorCode);
	}

	public void editorReviewBBSAdd(EditorReviewBBSVO editorReview) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.add("editorReivew_add", editorReview);
	}

	public void documentListAdd(List<DocumentVO> documentList) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.add("document_add", documentList);
	}

	public void contentListAdd(List<ContentVO> contentList) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.add("content_add", contentList);
	}

	public void memberListAdd(List<MemberVO> memberList) 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.add("member_add", memberList);
	}

	public void tempListAdd(List<TempVO> tempList) 
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.add("temp_add", tempList);
	}

	public void editorListAdd(List<EditorVO> editorList) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		genericService.add("editor_add", editorList);
	}

	public void editorCodeListAdd(List<EditorCodeVO> editorCodeList) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.add("editorCode_add", editorCodeList);
	}

	public void editorReviewBBSListAdd(List<EditorReviewBBSVO> editorReviewBBSList) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.add("editorReview_add", editorReviewBBSList);
	}
}
